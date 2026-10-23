import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.QA_URL || 'http://localhost:4321/';
const shots = path.resolve('shots');
await mkdir(shots, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb', '--hide-scrollbars'],
});

const pages = [
  ['home', ''],
  ['work', 'work/'],
  ['music', 'music/'],
  ['journal', 'blog/'],
  ['about', 'about/'],
  ['contact', 'contact/'],
  ['article', 'blog/mengenal-dasar-generative-ai/'],
  ['legal', 'privacy-policy/'],
];

const results = [];

async function prepare(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 620) {
    await page.evaluate((next) => window.scrollTo(0, next), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1100);
}

for (const [name, route] of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const issues = [];
  page.on('console', (message) => {
    if (message.type() === 'error') issues.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => {
    const error = request.failure()?.errorText || '';
    if (error.includes('ERR_ABORTED')) return;
    issues.push(`requestfailed: ${request.url()} — ${error}`);
  });

  const response = await page.goto(new URL(route, base).toString(), { waitUntil: 'networkidle' });
  await prepare(page);

  const metrics = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.getAttribute('aria-label') || document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth,
    height: document.documentElement.scrollHeight,
    brokenImages: [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
    remainingDeferredImages: document.querySelectorAll('img[data-src]').length,
    heroReady: Boolean(document.querySelector('.hero-visual.is-ready')),
    links: [...document.querySelectorAll('a[href]')].length,
  }));

  await page.screenshot({ path: path.join(shots, `${name}-final.png`) });
  if (name === 'home' || name === 'article' || name === 'work' || name === 'music') {
    await page.screenshot({ path: path.join(shots, `${name}-full-final.png`), fullPage: true });
  }

  results.push({ name, status: response?.status(), metrics, issues });
  await page.close();
}

// Mobile checks.
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mobileIssues = [];
mobile.on('console', (message) => {
  if (message.type() === 'error') mobileIssues.push(`console: ${message.text()}`);
});
mobile.on('pageerror', (error) => mobileIssues.push(`pageerror: ${error.message}`));

await mobile.goto(base, { waitUntil: 'networkidle' });
await prepare(mobile);
const mobileMetrics = await mobile.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth,
  height: document.documentElement.scrollHeight,
  brokenImages: [...document.images]
    .filter((image) => image.complete && image.naturalWidth === 0)
    .map((image) => image.currentSrc || image.src),
}));
await mobile.screenshot({ path: path.join(shots, 'mobile-home-final.png') });
await mobile.click('[data-nav-toggle]');
await mobile.waitForTimeout(500);
const menuRect = await mobile.locator('[data-mobile-menu]').boundingBox();
await mobile.screenshot({ path: path.join(shots, 'mobile-menu-final.png') });
await mobile.close();

const report = {
  results,
  mobile: { metrics: mobileMetrics, issues: mobileIssues, menuRect },
};
await writeFile(path.join(shots, 'qa-report-final.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

await browser.close();
