import { ref, watchEffect, computed } from 'vue';

export interface CartItem {
  title: string;
  sku: string;
  quantity: number;
  mainImage?: string | null;
  category?: string | null;
}

export interface Toast {
  id: string;
  message: string;
}

// Global reactive cart state
export const cart = ref<CartItem[]>([]);

// Global reactive toast notifications state
export const toasts = ref<Toast[]>([]);

// Load from localStorage on client-side initialization
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('cart');
  if (stored) {
    try {
      cart.value = JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing cart localStorage:', e);
    }
  }

  // Auto-persist changes in localStorage
  watchEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart.value));
  });
}

// Helper methods to manipulate the toasts
export function addToast(message: string) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.value.push({ id, message });
  
  // Auto-dismiss toast after 3 seconds
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000);
}

// Helper methods to manipulate the cart
export function addToCart(item: Omit<CartItem, 'quantity'>, qty = 1) {
  const existing = cart.value.find((i) => i.sku === item.sku);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.value.push({ ...item, quantity: qty });
  }
  
  addToast(`"${item.title}" añadido al carrito (${qty} ud).`);
}

export function removeFromCart(sku: string) {
  const item = cart.value.find((i) => i.sku === sku);
  const title = item ? item.title : 'Producto';
  cart.value = cart.value.filter((item) => item.sku !== sku);
  addToast(`"${title}" eliminado del carrito.`);
}

export function updateQuantity(sku: string, amount: number) {
  const item = cart.value.find((i) => i.sku === sku);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      removeFromCart(sku);
    }
  }
}

export function clearCart() {
  cart.value = [];
  addToast('Carrito vaciado.');
}

// Computed count of all items in the cart
export const cartCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});
