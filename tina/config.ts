// tina/config.ts
//
// Configuración del CMS local basado en Git (TinaCMS).
// Para instrucciones detalladas, consulta docs/tina.md.

import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      // Las imágenes que subas desde el panel de TinaCMS se guardan aquí
      // y se sirven desde /uploads/* en el sitio estático.
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      // ============================================================
      // COLECCIÓN: Producto
      // Cada archivo JSON dentro de src/content/products/ es un producto.
      // Crea un archivo nuevo desde el panel de Tina para añadir uno.
      // ============================================================
      {
        name: 'product',
        label: 'Productos',
        path: 'src/content/products',
        format: 'json',
        ui: {
          // Permite arrastrar y soltar para reordenar en el panel (opcional).
          router: ({ document }) => `/productos/${document._sys.filename}`,
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Nombre',
            description: 'Nombre visible del producto en el catálogo.',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'sku',
            label: 'Código / SKU',
            description: 'Identificador único. Se usa en el slug de la URL y como clave en el carrito.',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Descripción',
            description: 'Resumen corto que aparece en la card del catálogo.',
            ui: { component: 'textarea' },
          },
          {
            type: 'image',
            name: 'mainImage',
            label: 'Imagen principal',
            description: 'Sube la foto del producto. Formatos recomendados: WebP, JPG, PNG.',
          },
          {
            type: 'string',
            name: 'category',
            label: 'Categoría',
            description: 'Agrupa productos para que los visitantes puedan filtrarlos.',
            // Lista de categorías. Puedes ampliarla aquí o moverla a una
            // colección separada si necesitas gestionarla desde el panel.
            options: [
              'Vasos y Copas',
              'Platos y Bandejas',
              'Cubiertos Desechables',
              'Envases y Contenedores',
              'Bolsas y Empaques',
              'Higiene y Limpieza',
              'Otros',
            ],
          },
          {
            type: 'object',
            name: 'specs',
            label: 'Especificaciones',
            description: 'Pares propiedad/valor que se muestran en la ficha del producto (tabla técnica).',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.key || 'Nueva especificación' }),
            },
            fields: [
              { type: 'string', name: 'key', label: 'Propiedad' },
              { type: 'string', name: 'value', label: 'Valor' },
            ],
          },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Producto destacado',
            description: 'Si está activo, aparece en la sección "Destacados" del inicio.',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Orden',
            description: 'Número para ordenar manualmente (menor = primero). Déjalo en 0 para orden alfabético.',
            ui: { component: 'number' },
          },
        ],
      },
    ],
  },
});
