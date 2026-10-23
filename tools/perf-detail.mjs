import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--disable-gpu'],
});

for (const mode of ['normal', 'fast3g']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  if (mode === 'fast3g') {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  await page.addInitScript(() => {
    window.__lcp = { time: 0, tag: '', text: '' };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const entry = entries[entries.length - 1];
      window.__lcp = {
        time: entry.startTime,
        tag: entry.element?.tagName || '',
        id: entry.element?.id || '',
        className: entry.element?.className || '',
        text: (entry.element?.textContent || '').slice(0, 80),
        url: entry.url || '',
      };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  const started = Date.now();
  await page.goto('http://localhost:4321' + (process.env.PERF_PATH || '/'), { waitUntil: 'load', timeout: 60_000 });
  const load = Date.now() - started;
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      lcp: window.__lcp,
      resources: performance
        .getEntriesByType('resource')
        .filter((entry) => entry.transferSize > 3000)
        .map((entry) => ({
          name: entry.name.split('/').pop(),
          type: entry.initiatorType,
          bytes: entry.transferSize,
          end: Math.round(entry.responseEnd),
        })),
    };
  });
  console.log(mode, JSON.stringify({ elapsed: load, ...result }, null, 2));
  await context.close();
}

await browser.close();
