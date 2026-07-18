// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.SITE_URL || 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
