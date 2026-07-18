<script setup lang="ts">
import { computed } from 'vue';
import { useCart } from '../../composables/useCart';

const { count, items, isOpen, toggleDrawer } = useCart();

const label = computed(() => (count.value > 0 ? `Ver carrito, ${count.value} artículos` : 'Ver carrito'));
const showBadge = computed(() => count.value > 0);

// Aplica animación de bounce cada vez que cambia la cantidad
const bumpKey = computed(() => count.value);
</script>

<template>
  <button
    type="button"
    @click="toggleDrawer"
    :aria-label="label"
    :aria-expanded="isOpen"
    class="relative w-10 h-10 flex items-center justify-center rounded-xl border border-brand-border bg-brand-surface hover:bg-brand-background text-brand-primary hover:text-brand-accent transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 cursor-pointer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.8"
      stroke="currentColor"
      class="w-5 h-5"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z"
      />
    </svg>

    <span
      v-if="showBadge"
      :key="bumpKey"
      aria-live="polite"
      class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-background shadow-md motion-safe:animate-bounce-cart"
    >
      {{ count }}
    </span>
    <span v-if="items.length > 0" class="sr-only">{{ count }} artículos en el carrito</span>
  </button>
</template>

<style scoped>
@keyframes bounceCart {
  0% { transform: scale(0.4); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-cart {
  animation: bounceCart 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .animate-bounce-cart {
    animation: none;
  }
}
</style>
