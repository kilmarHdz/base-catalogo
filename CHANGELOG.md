# Changelog

Todos los cambios notables en este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Página 404 personalizada con branding
- Validación de variables de entorno (`src/config/env.ts`)
- Tipos derivados de TinaCMS (`src/types/product.ts`) compartidos entre páginas
- Campo `order` en schema de TinaCMS para control de orden manual
- Estructura i18n con `src/i18n/es.ts` y `src/i18n/en.ts`
- Composables Vue: `useCart`, `useToasts`, `useTheme`
- Tests unitarios con Vitest (cartStore, env, product slug)
- Tests E2E con Playwright (smoke del sitio)
- CI/CD con GitHub Actions (build + lint + tests en cada PR)
- Integración con `@astrojs/sitemap` y `public/robots.txt`
- Componente `Breadcrumb.astro` reutilizable
- Componente `JsonLd.astro` para datos estructurados SEO
- Variante `danger` en `Button.astro`
- Configuración de Cloudflare Pages (quitado adapter Node, output: 'static')
- `.nvmrc` con Node 22.12
- `.editorconfig` y `.prettierrc` para formato consistente
- Metadata completa en `package.json` (license, keywords, author)

### Changed
- `cartStore.ts` ahora es wrapper de retrocompatibilidad sobre composables
- `astro.config.mjs` ya no usa `@astrojs/node`; ahora es 100% SSG
- `astro.config.mjs` añade `site` URL (requerido para sitemap)
- `LayoutPrincipal.astro` omite tema-flash script usando `transition:persist`
- `ThemeToggle.vue`, `CartDrawer.vue`, `CatalogoFiltros.vue`, `AddToCartButton.vue` usan composables

### Removed
- `@astrojs/node` (ya no se usa; el proyecto es 100% SSG)

## [0.0.1] - 2025-07-12

### Added
- Versión inicial del boilerplate
- Astro 7 + Vue 3 + TinaCMS + Tailwind v4
- Layout principal con Navbar + Footer + CartDrawer
- Páginas: home, catálogo, ficha de producto, nosotros, contacto
- Sistema de design tokens `brand-*` con dark mode
- Imágenes de muestra en `public/uploads/`
- Productos de muestra en `src/content/products/`

[Unreleased]: https://github.com/usuario/base-catalogo/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/usuario/base-catalogo/releases/tag/v0.0.1
