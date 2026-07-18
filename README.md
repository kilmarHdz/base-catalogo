# Catálogo Base · Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Astro](https://img.shields.io/badge/Astro-7.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TinaCMS](https://img.shields.io/badge/TinaCMS-3.x-EC4815)](https://tina.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20%2B%20Playwright-6E9F18)](./tests)

Un **boilerplate de catálogo digital** construido con **Astro 7 + Vue 3 + TinaCMS + Tailwind v4**. Pensado para que puedas lanzar un sitio autogestionable (catálogo de productos, portafolio, etc.) personalizando un solo archivo de configuración y editando el contenido desde un panel visual — sin tocar código.

---

## ✨ Características

- 🏎️ **Astro 7** con Islands Architecture: HTML estático por defecto, JS solo donde hace falta
- ⚡ **Vue 3** (Composition API + `<script setup lang="ts">`) para las partes interactivas
- 🎨 **Tailwind CSS v4** con tokens semánticos `brand-*` y modo oscuro automático
- 📝 **TinaCMS** como CMS basado en Git (los cambios se commitean al repositorio)
- 🛒 **Carrito persistente** en `localStorage` con checkout vía WhatsApp
- 🔄 **View Transitions** de Astro (las imágenes "viajan" de la card a la ficha)
- ♿ **Accesible**: skip link, `aria-*` completo, `prefers-reduced-motion`
- 🚀 **SSG puro** — se compila a HTML estático, ideal para Cloudflare Pages
- 📬 **Form de contacto** vía Web3Forms (gratis, sin backend)
- 🌍 **i18n** con español por defecto y estructura lista para inglés
- 🧪 **Tests** Vitest (unit) + Playwright (E2E)
- 🤖 **CI/CD** con GitHub Actions

---

## 🚀 Inicio rápido

### Requisitos

- **Node.js ≥ 22.12** (usa `nvm use` para seleccionar la versión automáticamente)
- **pnpm ≥ 9** (`npm i -g pnpm`)

### Instalación

```bash
pnpm install
pnpm dev
```

Abre:
- `http://localhost:4321` → el sitio
- `http://localhost:4321/admin/index.html` → el panel de TinaCMS

### Build de producción

```bash
pnpm run build:ci
```

> El script `build:ci` levanta automáticamente el servidor de Tina en `:4001`, espera a que esté listo, compila Astro y lo apaga. Úsalo siempre que hagas build local.
>
> Si tienes credenciales de [Tina Cloud](https://tina.io/docs/r/what-is-tinacloud), puedes usar `pnpm run build` (más simple).

### Tests y lint

```bash
pnpm run lint         # astro check + tsc
pnpm run test:unit    # Vitest (no requiere nada extra)
pnpm run test:e2e     # Playwright (opcional, ver nota abajo)
pnpm run format       # Prettier en todo el repo
```

> **Sobre Playwright (tests E2E)**: ya están escritos (`tests/e2e/smoke.spec.ts`) y configurados (`playwright.config.ts`), y se ejecutan automáticamente en CI. **Localmente son opcionales**: la primera vez necesitas instalar el navegador con `pnpm exec playwright install chromium` (~150 MB). Si no los necesitas para tu flujo, puedes ignorar este paso — el resto del boilerplate funciona sin ellos.

### Preview

```bash
pnpm run preview
```

---

## 🛠️ Personalización

### 1. Edita `src/config/site.ts` (un solo archivo)

Aquí cambias **todo lo que no sean productos**: nombre del sitio, copy del hero, contacto, redes sociales, secciones "Nosotros", categorías destacadas, etc.

```ts
// src/config/site.ts
export default {
  brand: {
    name: 'Mi Empresa',        // Nombre que aparece en navbar/footer
    shortName: 'ME',            // Iniciales del logo cuadrado
    tagline: 'Mi tagline',
  },
  contact: {
    emails: ['hola@miempresa.com'],
    phoneDisplay: '+34 600 000 000',
    phoneRaw: '+34600000000',   // Usado para wa.me
  },
  // ...
}
```

Después de editar, ejecuta `pnpm dev` (o rebuild) para ver los cambios.

### 2. Edita el catálogo desde TinaCMS

Levanta el proyecto y abre `http://localhost:4321/admin/index.html`. Desde ahí puedes:

- Crear, editar y borrar productos
- Subir imágenes (se guardan en `public/uploads/`)
- Marcar productos como **destacados** (aparecen en la home)
- Asignarles un **orden** numérico (menor = primero)

> 📖 **Guía detallada de Tina**: lee [`docs/tina.md`](./docs/tina.md) para entender cómo está estructurado, cómo añadir campos personalizados y cómo resolver problemas comunes.

### 3. Cambia los colores

Los colores se definen en `src/styles/global.css` como variables CSS dentro de `@theme`:

```css
@theme {
  --color-brand-accent: var(--brand-accent);  /* Color principal de la marca */
  /* ... */
}
```

Y las paletas light/dark están en `:root` y `.dark`. Cambia los hex y Tailwind los usará automáticamente.

### 4. Reemplaza las imágenes de muestra

- Hero: `public/uploads/hero.png` (recomendado 1200×900 px)
- Productos: sube las tuyas desde TinaCMS, o reemplaza los archivos de `public/uploads/sample-product-*.png`

### 5. Cambia de idioma

Los strings traducibles están en `src/i18n/es.ts`. Para añadir inglés, edita `src/i18n/en.ts` y conecta el selector de idioma (próximamente en la UI; la infra ya está lista en `src/i18n/utils.ts`).

---

## 📁 Estructura del proyecto

```
.
├── astro.config.mjs           # Config de Astro (integrations, sitemap)
├── tina/
│   ├── config.ts              # Schema de TinaCMS (colecciones, campos)
│   └── __generated__/         # Cliente GraphQL + tipos autogenerados
├── public/
│   ├── uploads/               # Imágenes servidas (sube las tuyas aquí)
│   ├── admin/                 # Panel de TinaCMS compilado
│   └── robots.txt
├── scripts/
│   └── build-with-tina.sh     # Orquestador de build con Tina local
├── tests/
│   ├── unit/                  # Vitest (cartStore, env, types)
│   └── e2e/                   # Playwright (smoke tests)
├── .github/workflows/
│   └── ci.yml                 # Build + lint + tests en cada PR
└── src/
    ├── config/
    │   ├── site.ts            # ⭐ Toda la config del sitio (EDITAR AQUÍ)
    │   └── env.ts             # Validación de env vars
    ├── i18n/
    │   ├── index.ts
    │   ├── es.ts              # Strings en español
    │   └── en.ts              # Strings en inglés
    ├── types/
    │   └── product.ts         # Tipos derivados de Tina
    ├── composables/
    │   ├── useCart.ts         # Estado del carrito
    │   ├── useToasts.ts       # Notificaciones efímeras
    │   └── useTheme.ts        # Tema dark/light
    ├── components/
    │   ├── Button.astro       # Botón reusable (primary, secondary, ghost, danger, whatsapp, link)
    │   ├── Card.astro         # Card con slots
    │   ├── Badge.astro        # Chips / tags
    │   ├── Icon.astro         # 19 iconos SVG centralizados
    │   ├── Breadcrumb.astro
    │   ├── JsonLd.astro       # Datos estructurados SEO
    │   ├── Navbar.astro
    │   ├── Footer.astro
    │   └── vue/               # Islas interactivas
    │       ├── ThemeToggle.vue
    │       ├── CartDrawer.vue
    │       ├── AddToCartButton.vue
    │       ├── CatalogoFiltros.vue
    │       └── ContactForm.vue
    ├── content/
    │   └── products/          # 📦 JSONs de productos (gestionados por Tina)
    ├── layouts/
    │   └── LayoutPrincipal.astro
    ├── lib/
    │   └── cartStore.ts       # @deprecated: usar useCart composable
    ├── pages/
    │   ├── index.astro        # Home
    │   ├── nosotros.astro
    │   ├── contacto.astro
    │   ├── 404.astro          # Página 404 personalizada
    │   └── productos/
    │       ├── index.astro    # Catálogo (con isla Vue de filtros)
    │       └── [...slug].astro # Ficha de producto (generada por Tina)
    └── styles/
        └── global.css         # Tokens + Tailwind v4 + dark mode
```

---

## 📬 Formulario de contacto (Web3Forms)

El formulario usa [Web3Forms](https://web3forms.com) — un servicio gratuito que envía los submits a tu email sin necesidad de backend.

1. Entra en https://web3forms.com y obtén tu **Access Key** (gratis, 250 envíos/mes).
2. Crea un archivo `.env` en la raíz:

```bash
cp .env.example .env
```

3. Pega tu key:

```
PUBLIC_WEB3FORMS_KEY=tu-access-key-aqui
```

4. Reinicia `pnpm dev`.

Si dejas la variable vacía, verás un warning en consola y el form mostrará un mensaje explicativo al intentar enviar.

---

## 🌗 Modo oscuro

- Se activa automáticamente según las preferencias del sistema
- Toggle manual en la navbar (esquina superior derecha)
- La preferencia se guarda en `localStorage` y **persiste** entre páginas (gracias a `transition:persist`)

---

## 🌍 Despliegue

El proyecto compila a HTML estático en `dist/`. La configuración recomendada es **Cloudflare Pages** (bandwidth ilimitado gratis, mejor performance global).

### Cloudflare Pages (recomendado)

1. Sube el repo a GitHub.
2. Entra a [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages) y conecta el repo.
3. Configura el build:
   - **Build command**: `pnpm run build:ci`
   - **Build output directory**: `dist`
   - **Root directory**: (vacío)
   - **Environment variables**:
     - `NODE_VERSION` = `22.12.0`
     - `SITE_URL` = `https://tu-dominio.com` (para el sitemap)
     - `TINA_CLIENT_ID` y `TINA_TOKEN` (si usas Tina Cloud — recomendado)
4. Guarda y despliega.

> Para más detalles de Tina Cloud, ver [`docs/tina.md`](./docs/tina.md#tina-cloud-vs-tina-local).

### Vercel / Netlify

El proyecto también funciona en estas plataformas. Configuración:

- **Build command**: `pnpm run build:ci`
- **Output directory**: `dist`
- **Node version**: `22.12.0`

---

## 🗺️ Roadmap

Próximas mejoras planeadas:

- [ ] Selector de idioma visible en la navbar (i18n funcional end-to-end)
- [ ] OG image dinámica con `@vercel/og` o equivalente
- [ ] App icons (apple-touch-icon, manifest.json)
- [ ] Modo de "construcción" / coming-soon
- [ ] Documentación en Storybook para componentes
- [ ] Tests visuales con Percy/Chromatic
- [ ] Migrar el script `build-with-tina.sh` a `.mjs` cross-platform

Ver [`CHANGELOG.md`](./CHANGELOG.md) para el detalle de cambios.

---

## 📚 Documentación adicional

- [**`docs/tina.md`**](./docs/tina.md) — Guía completa de TinaCMS: schema, flujos, troubleshooting
- [Documentación de Astro](https://docs.astro.build)
- [Documentación de TinaCMS](https://tina.io/docs)

---

## 📄 Licencia

MIT — úsalo, modifícalo y distribúyelo libremente.
