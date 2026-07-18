/**
 * Tipos de producto derivados del schema de TinaCMS.
 *
 * El tipo `Product` se genera automáticamente en `tina/__generated__/types.ts`
 * cada vez que ejecutas `tinacms build`. Estos tipos derivados son vistas
 * simplificadas que omiten los metadatos internos de Tina (`_values`, `_sys`)
 * para que los componentes consumidores (Vue islands, cards, etc.) no necesiten
 * conocer la forma completa del nodo.
 */

import type { Product as TinaProduct } from '../../tina/__generated__/types';

export type Product = TinaProduct;

export type ProductSpec = NonNullable<Product['specs']>[number];

/** Vista simplificada de un producto para grids/cards (sin metadatos Tina). */
export type ProductCard = Pick<
  Product,
  'title' | 'sku' | 'description' | 'mainImage' | 'category' | 'featured' | 'specs'
> & {
  _sys: Pick<Product['_sys'], 'relativePath'>;
};

/** Vista completa de un producto para la ficha de detalle. */
export type ProductDetail = Product;

/** Slug URL-safe derivado de la ruta del archivo. */
export function productSlug(product: { _sys: { relativePath: string } }): string {
  return product._sys.relativePath.replace(/\.json$/, '');
}
