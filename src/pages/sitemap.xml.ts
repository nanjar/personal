import type { APIRoute } from 'astro';
import { articles } from '../lib/articles';
import { legalPages } from '../data/legal';
import { url } from '../lib/paths';

export const prerender = true;

const staticPages = ['/', '/work/', '/music/', '/blog/', '/about/', '/contact/'];

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://nanjarbudiman.com');
  const entries = [
    ...staticPages.map((path) => ({ path, lastmod: undefined, priority: path === '/' ? '1.0' : '0.8' })),
    ...articles.map((article) => ({
      path: `/blog/${article.slug}/`,
      lastmod: article.date,
      priority: '0.7',
    })),
    ...legalPages.map((page) => ({
      path: `/${page.slug}/`,
      lastmod: undefined,
      priority: '0.3',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${new URL(url(entry.path), origin).toString()}</loc>
${entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : ''}    <changefreq>${entry.priority === '0.3' ? 'yearly' : 'monthly'}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
