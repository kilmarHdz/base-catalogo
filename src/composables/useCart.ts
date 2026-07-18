/**
 * Composable para gestionar el carrito de compras.
 *
 * Estado global (singleton) sincronizado con localStorage en el cliente.
 * El composable encapsula la lógica de:
 *   - añadir / eliminar / actualizar cantidad
 *   - vaciar carrito
 *   - contar items
 *   - generar mensaje de checkout para WhatsApp
 *
 * SSR-safe: en el servidor, el estado se inicializa vacío y la carga
 * desde localStorage ocurre en el primer acceso en el cliente.
 */

import { ref, computed, watch, readonly, onMounted, type Ref, type ComputedRef } from 'vue';
import { useToasts } from './useToasts';

export interface CartItem {
  title: string;
  sku: string;
  quantity: number;
  mainImage?: string | null;
  category?: string | null;
}

const STORAGE_KEY = 'cart';

const cart: Ref<CartItem[]> = ref([]);
const isOpen: Ref<boolean> = ref(false);
let initialized = false;

function initFromStorage(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  initialized = true;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        cart.value = parsed;
      }
    } catch (err) {
      console.error('[useCart] Error parsing cart from localStorage:', err);
    }
  }

  watch(
    cart,
    (items) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error('[useCart] Error persisting cart:', err);
      }
    },
    { deep: true }
  );
}

export function useCart() {
  // Se difiere a onMounted para que el primer render en cliente coincida
  // con el SSR (carrito vacío) y evite mismatches de hidratación.
  onMounted(() => {
    initFromStorage();
  });

  const { push: pushToast } = useToasts();

  function addItem(item: Omit<CartItem, 'quantity'>, qty = 1): void {
    const existing = cart.value.find((i) => i.sku === item.sku);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.value.push({ ...item, quantity: qty });
    }
    pushToast(`"${item.title}" añadido al carrito (${qty} ud).`);
  }

  function removeItem(sku: string): void {
    const item = cart.value.find((i) => i.sku === sku);
    const title = item ? item.title : 'Producto';
    cart.value = cart.value.filter((i) => i.sku !== sku);
    pushToast(`"${title}" eliminado del carrito.`);
  }

  function updateQuantity(sku: string, amount: number): void {
    const item = cart.value.find((i) => i.sku === sku);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) {
      removeItem(sku);
    }
  }

  function clear(): void {
    cart.value = [];
    pushToast('Carrito vaciado.');
  }

  const count: ComputedRef<number> = computed(() =>
    cart.value.reduce((total, item) => total + item.quantity, 0)
  );

  function openDrawer(): void {
    isOpen.value = true;
  }

  function closeDrawer(): void {
    isOpen.value = false;
  }

  function toggleDrawer(): void {
    isOpen.value = !isOpen.value;
  }

  return {
    items: readonly(cart),
    count,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
}
