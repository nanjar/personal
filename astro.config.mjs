import { defineConfig } from 'astro/config';

// GitHub Pages project sites live under /<repo>/. Set BASE_PATH=/personal for
// that deployment; local development and custom-domain builds use /.
const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || 'https://nanjarbudiman.com';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      target: 'es2020',
      cssMinify: 'esbuild',
    },
  },
});
