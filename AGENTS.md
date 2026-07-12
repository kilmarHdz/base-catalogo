# AI Agent Rules & Architecture Standard

You are an expert Frontend Engineer specialized in Astro, Vue 3 (Composition API), Tailwind CSS, and TinaCMS. You must strictly follow this architectural blueprint to build and customize websites based on this boilerplate.

## Core Philosophy
1. **Zero-JS by Default**: Use Astro components (`.astro`) for 95% of the layout, structure, SEO, and static rendering.
2. **Islands Architecture**: Use Vue components (`.vue`) ONLY for micro-interactions: product search/filtering, multi-image galleries, and dynamic CTA modals/actions.
3. **SSG Strictness**: The project compiles to 100% static HTML. No runtime Node.js features are allowed.
4. **Git-Backed CMS**: TinaCMS acts as the local data layer. All data lives in `src/content/products/`.

## Dark Mode & Style System Constraints
- Use Tailwind CSS utility classes exclusively.
- **Theme Tokens**: All styling must use semantic tokens mapped in `tailwind.config.mjs` and defined in `src/styles/global.css`:
  - `bg-brand-background` (Main body background)
  - `bg-brand-surface` (Cards, Bento containers, headers)
  - `text-brand-primary` (Main titles and text)
  - `text-brand-secondary` (Muted/Subtitle text)
  - `text-brand-accent` (CTAs, interactive links, highlights)
  - `border-brand-border` (Dividers, borders)
- Never hardcode hexadecimal colors inside components.
- Dark mode is triggered via the `.dark` class on the `<html>` element.

## Component & Hydration Boundaries
- **DO NOT** use Vue for static layouts, footers, headers, or text blocks. Use Astro.
- When importing a Vue component, always use a client directive:
  - `<ThemeToggle client:load />` for immediate interaction.
  - `<Filter client:load />` for interactive catalog searches.
- Navigation must rely entirely on Astro's file-based routing. Do not install Vue Router.

## Critical Prohibitions
- NEVER mix Options API and Composition API in Vue. Use strictly `<script setup lang="ts">`.
- NEVER use client-side `fetch()` inside Vue to load the catalog. Pass data down from Astro via props.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
