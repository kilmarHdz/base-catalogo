<script setup lang="ts">
import { ref } from 'vue';
import { useCart } from '../../composables/useCart';
import { productSlug, type ProductCard as ProductCardType } from '../../types/product';

const props = defineProps<{
  producto: ProductCardType;
}>();

const { addItem } = useCart();
const addedSku = ref<string | null>(null);

const triggerAddToCart = (producto: ProductCardType) => {
  addItem({
    title: producto.title,
    sku: producto.sku,
    mainImage: producto.mainImage,
    category: producto.category,
  });
  addedSku.value = producto.sku;
  setTimeout(() => {
    if (addedSku.value === producto.sku) addedSku.value = null;
  }, 1000);
};
</script>

<template>
  <article
    :key="producto.sku"
    class="group bg-brand-surface border border-brand-border hover:border-brand-accent/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
  >
    <div class="relative overflow-hidden bg-brand-background aspect-[4/3]">
      <img
        v-if="producto.mainImage"
        :src="producto.mainImage"
        :alt="producto.title"
        loading="lazy"
        width="400"
        height="300"
        :style="{ 'view-transition-name': `product-image-${producto.sku}` }"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-12 h-12 text-brand-secondary/20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0z" />
        </svg>
      </div>

      <!-- Featured badge -->
      <span v-if="producto.featured" class="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded-md shadow-sm">
        ⭐ Destacado
      </span>

      <!-- Category badge -->
      <span class="absolute bottom-3 right-3 bg-brand-surface/80 backdrop-blur-sm text-brand-accent text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md border border-brand-border/50">
        {{ producto.category || 'General' }}
      </span>
    </div>

    <!-- Body -->
    <div class="flex flex-col flex-grow p-5">
      <h3 class="text-base font-extrabold text-brand-primary group-hover:text-brand-accent transition-colors duration-200 leading-snug text-pretty">
        {{ producto.title }}
      </h3>
      <p class="text-brand-secondary text-xs mt-2 line-clamp-2 leading-relaxed flex-grow">
        {{ producto.description }}
      </p>

      <!-- Footer row -->
      <div class="flex items-center justify-between pt-4 mt-4 border-t border-brand-border/60">
        <span class="text-[10px] text-brand-secondary/60 font-mono truncate min-w-0 mr-2">{{ producto.sku }}</span>

        <div class="flex items-center gap-2 shrink-0">
          <!-- Add to Cart -->
          <button
            @click="triggerAddToCart(producto)"
            :aria-label="`Añadir ${producto.title} al carrito`"
            :class="[
              'w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none',
              addedSku === producto.sku
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-brand-border bg-brand-surface hover:bg-brand-accent hover:border-brand-accent hover:text-white text-brand-secondary'
            ]"
          >
            <svg v-if="addedSku === producto.sku" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <!-- View Detail -->
          <a
            :href="`/productos/${productSlug(producto)}`"
            class="inline-flex items-center gap-1 text-xs font-bold text-brand-accent hover:text-brand-accent/70 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none rounded"
          >
            Ver ficha
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
