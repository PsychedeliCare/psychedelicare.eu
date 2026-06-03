// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import opengraphImages from 'astro-opengraph-images';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [mdx(), sitemap(), opengraphImages()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true
    }
  }
});