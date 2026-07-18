import { describe, it, expect } from 'vitest';
import { productSlug } from '../../src/types/product';
import type { Product } from '../../src/types/product';

const baseProduct = {
  title: 'Test',
  sku: 'TEST-01',
  description: null,
  mainImage: null,
  category: null,
  specs: null,
  featured: false,
  id: 'content/products/foo.json',
  _values: {},
} as unknown as Product;

describe('productSlug', () => {
  it('strips .json from relativePath', () => {
    const p = { ...baseProduct, _sys: { relativePath: 'vaso-12oz.json', filename: 'vaso-12oz', basename: 'vaso-12oz', path: 'content/products', extension: 'json', template: 'product', collection: { name: 'product', label: 'Productos' }, title: 'Test', breadcrumbs: ['content', 'products', 'vaso-12oz'], hasReferences: false } } as unknown as Product;
    expect(productSlug(p)).toBe('vaso-12oz');
  });

  it('handles nested relativePath', () => {
    const p = { ...baseProduct, _sys: { ...baseProduct._sys, relativePath: 'categoria/subcat/product.json' } } as unknown as Product;
    expect(productSlug(p)).toBe('categoria/subcat/product');
  });
});
