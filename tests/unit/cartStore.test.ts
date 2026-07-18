import { describe, it, expect, beforeEach } from 'vitest';
import { useCart } from '../../src/composables/useCart';
import type { CartItem } from '../../src/composables/useCart';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function freshCart() {
    const cart = useCart();
    cart.clear();
    return cart;
  }

  it('starts with an empty cart', () => {
    const { items, count } = freshCart();
    expect(items.value).toEqual([]);
    expect(count.value).toBe(0);
  });

  it('adds a new item', () => {
    const { items, addItem } = freshCart();
    addItem({ title: 'Test', sku: 'A1', mainImage: null, category: null });
    expect(items.value).toHaveLength(1);
    expect(items.value[0]).toMatchObject({ title: 'Test', sku: 'A1', quantity: 1 });
  });

  it('increments quantity when adding an existing sku', () => {
    const { items, addItem } = freshCart();
    addItem({ title: 'Test', sku: 'A1', mainImage: null, category: null });
    addItem({ title: 'Test', sku: 'A1', mainImage: null, category: null }, 2);
    expect(items.value).toHaveLength(1);
    expect(items.value[0].quantity).toBe(3);
  });

  it('removes an item by sku', () => {
    const { items, addItem, removeItem } = freshCart();
    addItem({ title: 'A', sku: 'A1', mainImage: null, category: null });
    addItem({ title: 'B', sku: 'B1', mainImage: null, category: null });
    removeItem('A1');
    expect(items.value).toHaveLength(1);
    expect(items.value[0].sku).toBe('B1');
  });

  it('updates quantity and removes when quantity drops to 0', () => {
    const { items, addItem, updateQuantity } = freshCart();
    addItem({ title: 'A', sku: 'A1', mainImage: null, category: null });
    updateQuantity('A1', -1);
    expect(items.value).toEqual([]);
  });

  it('clears the entire cart', () => {
    const { items, addItem, clear } = freshCart();
    addItem({ title: 'A', sku: 'A1', mainImage: null, category: null });
    addItem({ title: 'B', sku: 'B1', mainImage: null, category: null });
    clear();
    expect(items.value).toEqual([]);
  });

  it('persists items to localStorage', async () => {
    const { addItem } = freshCart();
    addItem({ title: 'Persisted', sku: 'P1', mainImage: null, category: null });
    await new Promise((r) => setTimeout(r, 10));
    const stored = localStorage.getItem('cart');
    expect(stored).toBeTruthy();
    const parsed: CartItem[] = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].sku).toBe('P1');
  });
});
