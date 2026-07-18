<script setup lang="ts">
import { ref } from 'vue';
import { useCart } from '../../composables/useCart';

const props = defineProps<{
  title: string;
  sku: string;
  mainImage?: string | null;
  category?: string | null;
}>();

const { addItem } = useCart();
const added = ref(false);
const quantity = ref(1);

const increment = () => {
  quantity.value++;
};

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = () => {
  if (added.value) return;

  addItem({
    title: props.title,
    sku: props.sku,
    mainImage: props.mainImage,
    category: props.category,
  }, quantity.value);

  added.value = true;

  setTimeout(() => {
    added.value = false;
  }, 1500);
};
</script>

<template>
  <div class="flex flex-col gap-3 w-full">
    <div class="flex items-center gap-1 p-1 bg-brand-background border border-brand-border rounded-xl w-fit self-end justify-end">
      <button
        @click="decrement"
        :disabled="quantity <= 1"
        aria-label="Disminuir cantidad"
        class="w-10 h-10 rounded-lg text-brand-secondary hover:bg-brand-border/40 hover:text-brand-primary flex items-center justify-center font-bold text-lg transition-colors duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
      >
        −
      </button>
      <span
        class="w-12 text-center font-extrabold text-brand-primary select-none text-base"
        role="status"
        aria-live="polite"
        :aria-label="`Cantidad: ${quantity}`"
      >
        {{ quantity }}
      </span>
      <button
        @click="increment"
        aria-label="Incrementar cantidad"
        class="w-10 h-10 rounded-lg text-brand-secondary hover:bg-brand-border/40 hover:text-brand-primary flex items-center justify-center font-bold text-lg transition-colors duration-200 cursor-pointer select-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
      >
        +
      </button>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch gap-2 w-full">
      <slot />

      <button
        @click="handleAddToCart"
        :class="[
          'flex-1 basis-0 min-w-0 font-bold text-center py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60',
          added
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
            : 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-brand-accent/25 hover:shadow-xl hover:-translate-y-px'
        ]"
        :aria-label="added ? `${title} añadido al carrito` : `Añadir ${title} al carrito`"
      >
        <svg
          v-if="added"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-5 h-5 motion-safe:animate-jump"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
        </svg>

        <span>{{ added ? '¡Añadido!' : 'Añadir' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes jump {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.animate-jump {
  animation: jump 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-jump {
    animation: none;
  }
}
</style>
