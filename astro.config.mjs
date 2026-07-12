// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [vue()],

  vite: {
    plugins: [tailwindcss()]
  }
});