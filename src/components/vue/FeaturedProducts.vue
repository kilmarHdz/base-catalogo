<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import type { ProductCard as ProductCardType } from '../../types/product';

defineProps<{
  productos: ProductCardType[];
}>();
</script>

<template>
  <div v-if="productos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProductCard
      v-for="producto in productos"
      :key="producto.sku"
      :producto="producto"
    />
  </div>
  <div v-else class="text-center py-16 text-brand-secondary text-sm bg-brand-surface border border-brand-border rounded-2xl">
    Aún no hay productos destacados. Crea uno desde el panel de TinaCMS.
  </div>
</template>
