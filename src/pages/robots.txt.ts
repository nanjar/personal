import type { APIRoute } from 'astro';
import { url } from '../lib/paths';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://nanjarbudiman.com');
  const sitemap = new URL(url('/sitemap.xml'), origin).toString();
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
