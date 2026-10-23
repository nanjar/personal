import * as THREE from 'three';

type Cleanup = () => void;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function glowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,.85)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,.22)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec3(7.1, 3.7, 5.4);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 n = normalize(normal);
    float slow = uTime * 0.075;
    float n1 = fbm(position * 0.72 + vec3(0.0, slow, slow * 0.4));
    float n2 = fbm(position * 1.65 - vec3(slow * 0.8, 0.0, slow));
    float displacement = ((n1 - 0.5) * 0.33 + (n2 - 0.5) * 0.075) * uIntensity;

    vec3 displaced = position + n * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

    vNormal = normalize(normalMatrix * n);
    vView = -mvPosition.xyz;
    vNoise = n1 + n2 * 0.35;
    vPosition = displaced;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  varying vec3 vPosition;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);

    float facing = clamp(dot(n, v), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 2.35);

    vec3 ink = vec3(0.015, 0.023, 0.021);
    vec3 lime = vec3(0.79, 1.0, 0.34);
    vec3 ember = vec3(1.0, 0.40, 0.20);
    vec3 sky = vec3(0.46, 0.68, 1.0);

    float side = smoothstep(-0.4, 0.78, n.x);
    vec3 edge = mix(ember, lime, side);
    edge = mix(edge, sky, smoothstep(0.15, 1.0, n.y) * 0.35);

    float bands = sin(vNoise * 19.0 - uTime * 0.4 + vPosition.y * 2.0) * 0.5 + 0.5;
    float contour = smoothstep(0.965, 1.0, bands) * 0.18;

    vec3 color = ink;
    color += edge * fresnel * 1.5;
    color += edge * contour * (0.25 + fresnel);
    color += vec3(0.10, 0.14, 0.07) * bands * (0.35 + fresnel * 0.8);

    vec3 light = normalize(vec3(-0.45, 0.8, 0.7));
    float specular = pow(max(dot(n, light), 0.0), 32.0);
    color += vec3(1.0, 0.96, 0.86) * specular * 0.7;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function makeOrbit(
  radius: number,
  color: number,
  opacity: number,
  rotation: [number, number, number],
  dashed = false,
): THREE.Group {
  const group = new THREE.Group();
  const points: THREE.Vector3[] = [];
  const segments = 196;
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = dashed
    ? new THREE.LineDashedMaterial({
        color,
        transparent: true,
        opacity,
        dashSize: 0.035,
        gapSize: 0.055,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    : new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
  const line = new THREE.Line(geometry, material);
  if (dashed) line.computeLineDistances();
  group.add(line);
  group.rotation.set(...rotation);
  return group;
}

function node(color: number, size: number): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(size, 12, 12),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
}

export function initHeroScene(container: HTMLElement): Cleanup {
  const target = container.querySelector<HTMLElement>('[data-hero-canvas]');
  if (!target) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.matchMedia('(max-width: 760px)').matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSmall,
      powerPreference: 'high-performance',
    });
  } catch {
    container.classList.add('is-fallback');
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 1.8));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  target.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  const root = new THREE.Group();
  scene.add(root);

  const glow = glowTexture();

  // The living core.
  const coreGeometry = new THREE.IcosahedronGeometry(1.52, isSmall ? 22 : 40);
  const coreMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1 },
    },
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  root.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.56, 6),
    new THREE.MeshBasicMaterial({
      color: 0xc9ff57,
      wireframe: true,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  root.add(wire);

  const outerGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glow,
      color: 0xbfff55,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    }),
  );
  outerGlow.scale.set(8.5, 8.5, 1);
  outerGlow.position.z = -1.8;
  root.add(outerGlow);

  // Orbit system.
  const orbits = new THREE.Group();
  orbits.rotation.x = 0.12;
  root.add(orbits);

  const orbitOuter = makeOrbit(2.55, 0xf2efe8, 0.2, [1.06, 0.14, 0.1]);
  const orbitTilted = makeOrbit(2.16, 0xc9ff57, 0.38, [0.3, 1.04, -0.22], true);
  const orbitInner = makeOrbit(1.92, 0x86b7ff, 0.22, [1.35, -0.2, 0.4]);
  orbits.add(orbitOuter, orbitTilted, orbitInner);

  const orbitNodeA = node(0xf2efe8, 0.028);
  orbitNodeA.position.set(2.55, 0, 0);
  const orbitNodeB = node(0xc9ff57, 0.042);
  orbitNodeB.position.set(-2.16, 0, 0);
  const orbitNodeC = node(0xff6b3d, 0.03);
  orbitNodeC.position.set(0, 1.92, 0);
  orbitOuter.add(orbitNodeA);
  orbitTilted.add(orbitNodeB);
  orbitInner.add(orbitNodeC);

  // A dusting of particles suspended around the object.
  const count = isSmall ? 520 : 1100;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const radius = 2.0 + Math.pow(Math.random(), 0.7) * 4.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.78;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    const pick = Math.random();
    color.set(pick > 0.9 ? 0xc9ff57 : pick > 0.78 ? 0xffa27f : 0xf2efe8);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: isSmall ? 0.035 : 0.028,
      map: glow,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      alphaTest: 0.001,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  root.add(particles);

  // Distant stars.
  const starCount = isSmall ? 650 : 1400;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    const radius = 10 + Math.random() * 24;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.cos(phi);
    starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      size: 0.028,
      color: 0xf2efe8,
      map: glow,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(stars);

  const pointer = { x: 0, y: 0 };
  const smoothPointer = { x: 0, y: 0 };
  let scrollProgress = 0;
  let visible = true;
  let running = true;
  let raf = 0;
  let ready = false;
  const start = performance.now();

  const resize = () => {
    const width = target.clientWidth;
    const height = target.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(target);
  resize();

  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  const onScroll = () => {
    scrollProgress = clamp(window.scrollY / Math.max(window.innerHeight, 1));
  };

  const onVisibility = () => {
    running = !document.hidden;
  };

  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  onScroll();

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0 },
  );
  visibilityObserver.observe(container);

  const render = () => {
    const time = (performance.now() - start) / 1000;
    const motion = reducedMotion ? 0 : 1;

    coreMaterial.uniforms.uTime.value = time * motion;
    smoothPointer.x += (pointer.x * motion - smoothPointer.x) * 0.045;
    smoothPointer.y += (pointer.y * motion - smoothPointer.y) * 0.045;

    root.rotation.y = time * 0.09 * motion + smoothPointer.x * 0.32;
    root.rotation.x = smoothPointer.y * 0.18;
    core.rotation.y = -time * 0.04 * motion;
    wire.rotation.y = time * 0.055 * motion;
    wire.rotation.x = -time * 0.025 * motion;
    particles.rotation.y = time * 0.012 * motion;
    stars.rotation.y = -time * 0.005 * motion;

    orbitOuter.rotation.z = time * 0.035 * motion;
    orbitTilted.rotation.z = -time * 0.05 * motion;
    orbitInner.rotation.z = time * 0.025 * motion;

    camera.position.x = smoothPointer.x * 0.5;
    camera.position.y = -smoothPointer.y * 0.32 - scrollProgress * 0.4;
    camera.position.z = 7.2 + scrollProgress * 1.25;
    camera.lookAt(0, scrollProgress * 0.5, 0);

    root.position.y = Math.sin(time * 0.35) * 0.045 * motion - scrollProgress * 0.35;
    root.scale.setScalar(1 - scrollProgress * 0.06);

    renderer.render(scene, camera);

    if (!ready) {
      container.classList.add('is-ready');
      ready = true;
    }
  };

  const loop = () => {
    if (!running) {
      raf = requestAnimationFrame(loop);
      return;
    }
    if (visible) render();
    raf = requestAnimationFrame(loop);
  };

  if (reducedMotion) {
    render();
  } else {
    loop();
  }

  return () => {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    coreGeometry.dispose();
    coreMaterial.dispose();
    particleGeometry.dispose();
    starGeometry.dispose();
    glow.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
