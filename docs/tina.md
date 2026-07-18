# TinaCMS · Guía completa

> TinaCMS es un CMS **basado en Git**: en vez de tener una base de datos externa, todo el contenido vive en archivos del repositorio (JSON o Markdown). El panel admin de Tina lee y escribe esos archivos directamente, y cada cambio se traduce en un commit. **No necesitas base de datos ni hosting especial para tu CMS.**

Este boilerplate usa Tina para gestionar los **productos del catálogo**. Todo lo demás (textos del sitio, copy, contacto) se edita directamente en `src/config/site.ts`.

---

## 📑 Índice

1. [Cómo acceder al panel](#cómo-acceder-al-panel)
2. [Cómo funciona](#cómo-funciona)
3. [Crear tu primer producto](#crear-tu-primer-producto)
4. [Editar un producto existente](#editar-un-producto-existente)
5. [Subir imágenes](#subir-imágenes)
6. [Productos destacados](#productos-destacados)
7. [Estructura del schema](#estructura-del-schema)
8. [Personalizar el schema](#personalizar-el-schema)
9. [Tina Cloud vs Tina Local](#tina-cloud-vs-tina-local)
10. [Troubleshooting](#troubleshooting)

---

## Cómo acceder al panel

Con el proyecto en marcha (`pnpm dev`), abre:

```
http://localhost:4321/admin/index.html
```

Verás una pantalla de login. En desarrollo local puedes entrar sin credenciales (modo local). En producción necesitas una cuenta de [Tina Cloud](https://tina.io).

---

## Cómo funciona

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Panel TinaCMS   │  ─────▶ │  Archivos JSON   │  ─────▶ │  Build de Astro   │
│  (en el browser) │  save   │  en el repo      │  read   │  genera HTML      │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

1. Abres el panel de Tina, editas un producto y le das a "Save".
2. Tina escribe el cambio en `src/content/products/<categoría>/<slug>.json`.
3. Si tienes Git, también crea un commit automático.
4. Cuando ejecutas `pnpm dev` (o rebuilds), Astro lee el JSON actualizado y muestra el nuevo contenido.

**Importante**: el panel de Tina **escribes contenido**, no código. Para añadir nuevas categorías o campos al schema, necesitas editar `tina/config.ts` y reiniciar el dev server.

---

## Crear tu primer producto

1. Abre el panel en `http://localhost:4321/admin/index.html`.
2. En el menú lateral izquierdo, haz clic en **"Productos"**.
3. Arriba a la derecha, haz clic en el botón **"+"** o **"New Product"**.
4. Rellena los campos:
   - **Nombre** *(obligatorio)*: nombre visible del producto.
   - **Código / SKU** *(obligatorio)*: identificador único. Se usa en la URL de la ficha.
   - **Descripción**: resumen corto (1-2 frases).
   - **Imagen principal**: haz clic y sube una imagen.
   - **Categoría**: selecciona una del desplegable.
   - **Especificaciones**: añade filas con `Propiedad` / `Valor` (ej: `Material` / `Acero`).
   - **Producto destacado**: marca esta casilla si quieres que aparezca en la home.
5. Haz clic en **Save**.

El producto se guarda en `src/content/products/<carpeta>/<slug>.json` y se publica automáticamente.

---

## Editar un producto existente

1. Abre el panel.
2. En la lista de productos, haz clic en el que quieras editar.
3. Modifica los campos que necesites.
4. **Save**.

Los cambios aparecen al instante en `pnpm dev`. En producción, necesitas hacer un nuevo build (`pnpm run build:ci`).

---

## Subir imágenes

Cuando editas un producto, el campo **Imagen principal** te permite:

- **Subir desde tu equipo**: haz clic en el campo y selecciona el archivo. Tina lo guarda en `public/uploads/<nombre-unico>` y actualiza la ruta en el JSON automáticamente.
- **Pegar una URL externa**: si tu imagen ya está en otro sitio (CDN, etc.), pégala directamente.
- **Elegir entre las subidas**: Tina recuerda las imágenes que has subido antes.

**Formatos recomendados**: WebP (mejor compresión), JPG, PNG.
**Tamaño recomendado**: 800×800 px o superior. Las imágenes se sirven con `loading="lazy"` excepto la primera (que usa `fetchpriority="high"`).

---

## Productos destacados

Los productos con el campo `featured = true` aparecen en la sección **"Destacados"** de la home (máximo 3). Úsalo para resaltar tus productos estrella.

---

## Estructura del schema

El schema está en `tina/config.ts`. Define qué colecciones existen y qué campos tiene cada una. La colección principal es `product`:

```ts
{
  name: 'product',
  label: 'Productos',
  path: 'src/content/products',  // Carpeta donde se guardan los JSONs
  format: 'json',
  fields: [
    { type: 'string', name: 'title', label: 'Nombre', isTitle: true, required: true },
    { type: 'string', name: 'sku', label: 'Código / SKU', required: true },
    { type: 'string', name: 'description', label: 'Descripción', ui: { component: 'textarea' } },
    { type: 'image', name: 'mainImage', label: 'Imagen principal' },
    { type: 'string', name: 'category', label: 'Categoría', options: ['General', 'Destacados', 'Categoría A', 'Categoría B', 'Categoría C'] },
    { type: 'object', name: 'specs', label: 'Especificaciones', list: true, fields: [
      { type: 'string', name: 'key', label: 'Propiedad' },
      { type: 'string', name: 'value', label: 'Valor' },
    ] },
    { type: 'boolean', name: 'featured', label: 'Producto destacado' },
  ],
}
```

### ¿Por qué `path: "src/content/products"` y no subcarpetas por categoría?

Tina genera automáticamente subcarpetas cuando el schema lo define explícitamente. En este boilerplate preferimos mantener la colección plana (todos los productos al mismo nivel dentro de `products/`) porque:

- Las URLs son más cortas: `/productos/<slug>.json` en vez de `/productos/<carpeta>/<slug>.json`
- La búsqueda y filtrado es más simple
- El admin panel no se vuelve complejo con muchas carpetas

Si prefieres subcarpetas por categoría, edita `tina/config.ts` y cambia el `path` a `src/content/products/<categoría>` y crea una colección por categoría. Es más trabajo pero más organizado para catálogos muy grandes.

---

## Personalizar el schema

### Añadir un campo nuevo

Supón que quieres añadir un campo **"Precio"** a los productos. Edita `tina/config.ts`:

```ts
{
  type: 'number',
  name: 'price',
  label: 'Precio',
  description: 'Precio en euros (sin IVA).',
},
```

Reinicia `pnpm dev`. El nuevo campo aparecerá en el panel de Tina para todos los productos existentes (quedará vacío/null hasta que lo rellenes).

### Cambiar las opciones de categoría

Edita el array `options` del campo `category`:

```ts
{
  type: 'string',
  name: 'category',
  label: 'Categoría',
  options: ['Electrónica', 'Hogar', 'Moda', 'Otros'],  // ← Edita esto
}
```

### Ordenar productos

El schema incluye un campo `order: number` opcional para control de orden manual. Para usarlo en las queries:

```ts
// src/pages/productos/index.astro
const response = await client.queries.productConnection({
  sort: 'order_ASC',  // Sintaxis: campo_DIRECCION (ASC o DESC)
  first: 500,
});
```

> ⚠️ **Importante**: si ningún producto tiene el campo `order` definido, el `sort: 'order_ASC'` puede devolver 0 resultados. Asegúrate de que al menos los productos que quieres mostrar tengan un valor numérico en `order`, o quita el `sort` y ordena en JavaScript.

### Tipos de campo disponibles

Tina soporta muchos tipos. Los más comunes:

| Tipo       | Uso                                  | Ejemplo                              |
| ---------- | ------------------------------------ | ------------------------------------ |
| `string`   | Texto corto                          | `name`, `sku`                        |
| `string` + `ui.textarea` | Texto largo (varias líneas) | `description`                  |
| `image`    | Imagen con upload                    | `mainImage`                          |
| `boolean`  | Checkbox                             | `featured`                           |
| `number`   | Número                               | `price`, `stock`                     |
| `datetime` | Fecha y hora                         | `releaseDate`                       |
| `object` + `list: true` | Lista de objetos repetibles | `specs`              |
| `reference`| Referencia a otra colección          | (no usado en este boilerplate)       |

Consulta la [documentación oficial de Tina](https://tina.io/docs/reference/types/) para la lista completa.

---

## Tina Cloud vs Tina Local

### Tina Local (este boilerplate por defecto)

- ✅ Funciona sin cuenta ni credenciales
- ✅ Ideal para desarrollo
- ❌ El panel admin **no funciona en producción** (apunta a `localhost:4001`)
- ❌ Sin autenticación, sin colaboración en tiempo real

### Tina Cloud (recomendado para producción)

Para que el panel admin funcione en producción, necesitas:

1. Crear una cuenta gratuita en [https://tina.io](https://tina.io).
2. Conectar tu repositorio de GitHub.
3. Obtener `TINA_CLIENT_ID` y `TINA_TOKEN` desde el dashboard.
4. Configurarlos como variables de entorno en tu plataforma de deploy (Cloudflare Pages, Netlify, Vercel…).
5. Cambiar el script de build a `pnpm run build` (sin `--local --skip-cloud-checks`).

Una vez configurado, cualquier cambio desde el panel hace commit automáticamente en tu repo y se redespliega.

---

## Troubleshooting

### "Error: Client not configured properly. Missing clientId, token."

Estás intentando hacer `pnpm run build` sin credenciales de Tina Cloud. Usa `pnpm run build:ci` en su lugar (modo local).

### El panel admin muestra "Page not found" en producción

No has configurado Tina Cloud. Sigue los pasos de la sección anterior.

### Los cambios en Tina no se reflejan en el sitio

1. ¿Has reiniciado `pnpm dev`? Tina escribe los JSONs pero Astro necesita releerlos.
2. En producción, ¿has hecho un nuevo build? Tina no dispara rebuilds automáticamente (salvo que uses Tina Cloud con auto-deploy).
3. Revisa que el JSON se haya escrito correctamente: `cat src/content/products/<carpeta>/<slug>.json`.

### "fetch failed connect ECONNREFUSED 127.0.0.1:4001"

El cliente Tina (generado en `tina/__generated__/client.ts`) apunta a `localhost:4001` (modo local), pero el servidor de Tina no está corriendo. Esto pasa cuando:

- Hiciste `astro build` sin antes levantar Tina. Solución: usa `pnpm run build:ci`.
- El dev server se cayó. Solución: mata el proceso en :4001 y reinicia `pnpm dev`.

### Las imágenes no se ven

- Verifica que el archivo existe en `public/uploads/`.
- Si la URL en el JSON es relativa (`/uploads/...`), comprueba que la imagen está en `public/uploads/`.
- Si la URL es absoluta (`https://...`), el problema es externo.

### ¿Cómo borro un producto?

1. Abre el panel.
2. Selecciona el producto.
3. Arriba a la derecha, haz clic en los **"..."** (menú) y selecciona **Delete**.
4. Confirma.

Alternativamente, borra el archivo JSON manualmente desde tu editor y haz commit.

### ¿Puedo usar Markdown en vez de JSON?

Sí. Cambia `format: 'json'` por `format: 'md'` en `tina/config.ts`. Los productos se guardarán como archivos `.md` con frontmatter. Útil si prefieres escribir las descripciones en Markdown.

---

## Recursos útiles

- [Documentación oficial de Tina](https://tina.io/docs)
- [Tipos de campo en Tina](https://tina.io/docs/reference/types/)
- [Tina Cloud](https://tina.io/cloud)
- [Web3Forms](https://web3forms.com) (para el form de contacto)
