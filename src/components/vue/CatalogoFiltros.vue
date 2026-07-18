<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ProductCard from './ProductCard.vue';
import type { Product } from '../../types/product';

const props = defineProps<{
  productos: Product[];
}>();

// ─── Filters ──────────────────────────────────────────────────────────
const searchQuery = ref('');
const selectedCategory = ref('Todas');
const onlyFeatured = ref(false);

const categories = computed(() => {
  const list = new Set<string>();
  props.productos.forEach((p) => { if (p.category) list.add(p.category); });
  return ['Todas', ...Array.from(list)];
});

const filteredProducts = computed(() => {
  return props.productos.filter((producto) => {
    const matchesSearch =
      producto.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      producto.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (producto.description && producto.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesCategory = selectedCategory.value === 'Todas' || producto.category === selectedCategory.value;
    const matchesFeatured = !onlyFeatured.value || producto.featured;
    return matchesSearch && matchesCategory && matchesFeatured;
  });
});

// ─── Pagination ────────────────────────────────────────────────────────
const PAGE_SIZE = 6;
const currentPage = ref(1);

watch([searchQuery, selectedCategory, onlyFeatured], () => {
  currentPage.value = 1;
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / PAGE_SIZE));

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredProducts.value.slice(start, start + PAGE_SIZE);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    document.getElementById('catalogo-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;
  const pages: number[] = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<template>
  <div class="space-y-8" id="catalogo-grid">

    <!-- ── Search & Filters ── -->
    <div class="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
      <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">

        <!-- Search Input -->
        <div class="relative w-full md:max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o SKU…"
            autocomplete="off"
            aria-label="Buscar productos"
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-primary placeholder-brand-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:border-brand-accent transition-all duration-200 text-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 absolute left-3 top-3.5 text-brand-secondary/50 pointer-events-none" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637z" />
          </svg>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none',
                selectedCategory === cat
                  ? 'bg-brand-accent text-white border-brand-accent shadow-sm shadow-brand-accent/20'
                  : 'bg-brand-background text-brand-secondary border-brand-border hover:border-brand-accent/40 hover:text-brand-accent'
              ]"
              :aria-pressed="selectedCategory === cat"
            >
              {{ cat }}
            </button>
          </div>

          <label class="flex items-center gap-2 cursor-pointer select-none py-1.5 px-3 bg-brand-background border border-brand-border rounded-lg hover:bg-brand-border/20 transition-colors duration-200 shrink-0" :class="{'border-brand-accent/40': onlyFeatured}">
            <input v-model="onlyFeatured" type="checkbox" class="sr-only peer" aria-label="Mostrar solo destacados" />
            <div class="relative w-8 h-4 bg-brand-border rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent/30 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-accent"></div>
            <span class="text-xs font-semibold text-brand-primary">⭐ Destacados</span>
          </label>
        </div>
      </div>

      <p class="text-[11px] text-brand-secondary/60 mt-4 font-medium" aria-live="polite">
        {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados' }}
        <template v-if="totalPages > 1"> · Página {{ currentPage }} de {{ totalPages }}</template>
      </p>
    </div>

    <!-- ── Products Grid ── -->
    <div v-if="pagedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <ProductCard
        v-for="producto in pagedProducts"
        :key="producto.sku"
        :producto="producto"
      />
    </div>

    <!-- ── Empty State ── -->
    <div v-else class="text-center py-20 bg-brand-surface border border-brand-border rounded-2xl shadow-sm">
      <div class="inline-flex p-4 bg-brand-background rounded-full text-brand-secondary/40 mb-4" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-brand-primary">Sin resultados</h3>
      <p class="text-brand-secondary text-sm mt-1 max-w-xs mx-auto">Ajusta los filtros o realiza una búsqueda diferente.</p>
    </div>

    <!-- ── Pagination ── -->
    <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4" aria-label="Paginación del catálogo">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        aria-label="Página anterior"
        class="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-brand-secondary hover:bg-brand-surface hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <template v-if="visiblePages[0] > 1">
        <button @click="goToPage(1)" class="w-9 h-9 rounded-xl border border-brand-border text-sm font-bold text-brand-secondary hover:bg-brand-surface hover:text-brand-primary transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none" aria-label="Ir a página 1">1</button>
        <span v-if="visiblePages[0] > 2" class="text-brand-secondary text-sm px-1">…</span>
      </template>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :aria-label="`Ir a página ${page}`"
        :aria-current="page === currentPage ? 'page' : undefined"
        :class="[
          'w-9 h-9 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none',
          page === currentPage
            ? 'bg-brand-accent border-brand-accent text-white shadow-sm shadow-brand-accent/20'
            : 'border-brand-border text-brand-secondary hover:bg-brand-surface hover:text-brand-primary'
        ]"
      >
        {{ page }}
      </button>

      <template v-if="visiblePages[visiblePages.length - 1] < totalPages">
        <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="text-brand-secondary text-sm px-1">…</span>
        <button @click="goToPage(totalPages)" :aria-label="`Ir a página ${totalPages}`" class="w-9 h-9 rounded-xl border border-brand-border text-sm font-bold text-brand-secondary hover:bg-brand-surface hover:text-brand-primary transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none">{{ totalPages }}</button>
      </template>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        aria-label="Página siguiente"
        class="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-brand-secondary hover:bg-brand-surface hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </nav>

  </div>
</template>
