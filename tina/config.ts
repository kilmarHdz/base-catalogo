// tina/config.ts
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.HEAD || "main",
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "product",
        label: "Catálogo de Productos",
        path: "src/content/products",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Nombre del Producto", isTitle: true, required: true },
          { type: "string", name: "sku", label: "Código / SKU", required: true },
          { type: "string", name: "description", label: "Descripción Corta", ui: { component: "textarea" } },
          { type: "image", name: "mainImage", label: "Imagen Principal" },
          { type: "string", name: "category", label: "Categoría", options: ["General"] },
          {
            type: "object",
            name: "specs",
            label: "Especificaciones Técnicas",
            list: true,
            fields: [
              { type: "string", name: "key", label: "Propiedad" },
              { type: "string", name: "value", label: "Valor" }
            ]
          },
          { type: "boolean", name: "featured", label: "Producto Destacado" }
        ],
      },
    ],
  },
});