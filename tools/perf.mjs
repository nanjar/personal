import { chromium } from 'playwright-core';

const base = process.env.QA_URL || 'http://localhost:4321/';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb'],
});

const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

await page.addInitScript(() => {
  window.__lcp = 0;
  window.__cls = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    window.__lcp = entries[entries.length - 1].startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__cls += entry.value;
    }
  }).observe({ type: 'layout-shift', buffered: true });
});

const started = Date.now();
await page.goto(base, { waitUntil: 'load', timeout: 60_000 });
const loadElapsed = Date.now() - started;
await page.waitForTimeout(2500);

const metrics = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  const resources = performance.getEntriesByType('resource').map((entry) => ({
    name: entry.name.split('/').pop(),
    type: entry.initiatorType,
    bytes: entry.transferSize,
    duration: Math.round(entry.duration),
  }));
  const byType = resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + resource.bytes;
    return acc;
  }, {});
  return {
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
    load: Math.round(nav.loadEventEnd),
    response: Math.round(nav.responseStart),
    firstPaint: Math.round(paint.find((entry) => entry.name === 'first-paint')?.startTime || 0),
    firstContentfulPaint: Math.round(paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0),
    largestContentfulPaint: Math.round(window.__lcp),
    cumulativeLayoutShift: Number(window.__cls.toFixed(4)),
    transferTotal: nav.transferSize + resources.reduce((sum, resource) => sum + resource.bytes, 0),
    byType,
    resources: resources.filter((resource) => resource.bytes > 20_000),
  };
});

console.log(JSON.stringify({ loadElapsed, metrics }, null, 2));
await browser.close();
