export const site = {
  name: 'Nanjar Budiman',
  title: 'Nanjar Budiman — AI content creator, music & cinematic video',
  description:
    'Nanjar Budiman is an AI content creator from Bandung, Indonesia, working across AI music, cinematic video, generative storytelling, and creative automation.',
  location: 'Bandung, Indonesia',
  coordinates: '6.9175° S, 107.6191° E',
  tagline: 'Where human creativity meets artificial intelligence.',
  email: 'me@nanjarbudiman.com',
  emailHref: `mailto:me@nanjarbudiman.com?subject=${encodeURIComponent(
    'Project inquiry — Nanjar Budiman',
  )}&body=${encodeURIComponent(
    "Hi Nanjar,\n\nWhat I'm making:\nWho it's for:\nDeadline:\nReferences:\n\nThanks!",
  )}`,
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Music', href: '/music/' },
  { label: 'Journal', href: '/blog/' },
  { label: 'About', href: '/about/' },
];

export const socials = [
  { label: 'Instagram', handle: '@nanjarbudiman', href: 'https://instagram.com/nanjarbudiman', icon: 'instagram' },
  { label: 'YouTube', handle: '/nanjar2000', href: 'https://youtube.com/nanjar2000', icon: 'youtube' },
  { label: 'TikTok', handle: '@nanjarbudiman', href: 'https://tiktok.com/@nanjarbudiman', icon: 'tiktok' },
  { label: 'Facebook', handle: 'Nanjar Budiman', href: 'https://facebook.com/pamungkas.tea.7', icon: 'facebook' },
] as const;

export type Video = {
  id: string;
  title: string;
  category: 'Music Video' | 'AI Film' | 'Cinematic';
  description: string;
  featured?: boolean;
};

export const videos: Video[] = [
  {
    id: 'wQUN3uDIeQk',
    title: 'The AI Maverick',
    category: 'Music Video',
    description: 'Generative visual production for an original AI-made track.',
    featured: true,
  },
  {
    id: 'NseJYILni3w',
    title: 'Cyberpunk Future City',
    category: 'AI Film',
    description: 'A neon-soaked city built frame by frame with generative tools.',
    featured: true,
  },
  {
    id: 'cKceicrAb6I',
    title: 'Crowded, but Alone',
    category: 'Cinematic',
    description: 'A quiet study of solitude inside a city that never stops moving.',
    featured: true,
  },
  {
    id: 'Nmk2_PBU5J8',
    title: 'Belum Saatnya Lelah',
    category: 'Music Video',
    description: 'Lyric-driven storytelling and grainy, hand-held visual language.',
    featured: true,
  },
  {
    id: 'ctj_n08na30',
    title: 'Unshaken',
    category: 'Music Video',
    description: 'A steady, cinematic visual companion to a song about resolve.',
  },
  {
    id: 'KrjvhmmMr3c',
    title: 'The Direction of Fate',
    category: 'Music Video',
    description: 'Generative imagery following a story of chance and consequence.',
  },
  {
    id: 'Cy0L3U72N90',
    title: 'The Flower in The Window',
    category: 'Music Video',
    description: 'Soft light, small details, and a song that lingers.',
  },
  {
    id: 'DeD480Y9_E0',
    title: 'Sudahkah Mencintai Tulus',
    category: 'Music Video',
    description: 'An intimate visual treatment for a question about sincere love.',
  },
  {
    id: 'bzl6l4PynZc',
    title: 'Bakti Yang Terlupa',
    category: 'Music Video',
    description: 'A visual reflection on duty, family, and things left unsaid.',
  },
  {
    id: 'mEhx4nO0t6A',
    title: 'Bisikan Untuk Anakku',
    category: 'Music Video',
    description: 'A whispered message transformed into moving images.',
  },
  {
    id: 'augTPEaDbq4',
    title: 'Yaa Rohmaan Yaa Rohiim',
    category: 'Music Video',
    description: 'A contemplative, atmospheric visual accompaniment.',
  },
  {
    id: '0_VC2DiuBko',
    title: 'AI Music Video',
    category: 'AI Film',
    description: 'An experiment in image-to-video, rhythm, and synthetic texture.',
  },
];

export const featuredVideos = videos.filter((video) => video.featured);

export type Track = {
  title: string;
  album?: string;
  spotifyId: string;
  cover?: 'biarkan';
  hue: number;
  accent: string;
};

export const tracks: Track[] = [
  {
    title: 'Biarkan Aku Pulang Lebih Dulu',
    spotifyId: '76koe7PZB0QdC1axcIgRh6',
    cover: 'biarkan',
    hue: 24,
    accent: '#e9a36b',
  },
  {
    title: 'Super Hero Tanpa Sayap',
    spotifyId: '68QaG3DzxpATp5dOoIp9vY',
    hue: 206,
    accent: '#7cc7ff',
  },
  {
    title: 'Crowded, but Alone',
    spotifyId: '6UBT9DRi2tFUOQcjBMmkyW',
    hue: 262,
    accent: '#b5a2ff',
  },
  {
    title: 'Arafah',
    spotifyId: '10H2SGD4HkGgdkHChyXXER',
    hue: 40,
    accent: '#e8d187',
  },
  {
    title: 'Masa Putih Abu-abu',
    spotifyId: '234Fy8tOshXbs0tXG1JD51',
    hue: 98,
    accent: '#c9ff57',
  },
  {
    title: 'Tak Sempurna',
    spotifyId: '5A9iayWLh7Lxi41wf1Dv7k',
    hue: 344,
    accent: '#ff9cae',
  },
];

export const services = [
  {
    number: '01',
    title: 'AI Music',
    kicker: 'Concept → release',
    text: 'Original songs, lyrics, and AI-assisted production taken from the first idea to a release-ready master.',
    tags: ['Suno', 'Songwriting', 'Production'],
  },
  {
    number: '02',
    title: 'Cinematic Video',
    kicker: 'Premise → final cut',
    text: 'Story-led films using generative keyframes, image-to-video, editorial rhythm, sound, and color.',
    tags: ['Storyboard', 'Image-to-video', 'Edit & grade'],
  },
  {
    number: '03',
    title: 'Creative Automation',
    kicker: 'Workflow → system',
    text: 'Local LLMs, agents, and n8n workflows that turn repetitive production work into dependable infrastructure.',
    tags: ['n8n', 'Local LLM', 'Agents'],
  },
] as const;

export const stats = [
  { value: '12', label: 'films & music videos' },
  { value: '06', label: 'released tracks' },
  { value: '08', label: 'field notes' },
];
