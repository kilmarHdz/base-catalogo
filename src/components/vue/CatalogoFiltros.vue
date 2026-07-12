<script setup lang="ts">
import { ref, computed } from 'vue';
import { addToCart } from '../../lib/cartStore';

interface Spec {
  key?: string | null;
  value?: string | null;
}

interface ProductNode {
  title: string;
  sku: string;
  description?: string | null;
  mainImage?: string | null;
  category?: string | null;
  specs?: Spec[] | null;
  featured?: boolean | null;
  _sys: {
    filename: string;
    relativePath: string;
  };
}

const props = defineProps<{
  productos: ProductNode[];
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

// Reset page to 1 whenever filters change
import { watch } from 'vue';
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
    // Smooth scroll to top of catalog
    document.getElementById('catalogo-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Visible page numbers (max 5, centered around current)
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

// ─── Cart ──────────────────────────────────────────────────────────────
const addedSku = ref<string | null>(null);

const triggerAddToCart = (producto: ProductNode) => {
  addToCart({
    title: producto.title,
    sku: producto.sku,
    mainImage: producto.mainImage,
    category: producto.category
  });
  addedSku.value = producto.sku;
  setTimeout(() => {
    if (addedSku.value === producto.sku) addedSku.value = null;
  }, 1000);
};
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
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <!-- Category Chips -->
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

          <!-- Featured Switch -->
          <label class="flex items-center gap-2 cursor-pointer select-none py-1.5 px-3 bg-brand-background border border-brand-border rounded-lg hover:bg-brand-border/20 transition-colors duration-200 shrink-0" :class="{'border-brand-accent/40': onlyFeatured}">
            <input v-model="onlyFeatured" type="checkbox" class="sr-only peer" aria-label="Mostrar solo destacados" />
            <div class="relative w-8 h-4 bg-brand-border rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent/30 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-accent"></div>
            <span class="text-xs font-semibold text-brand-primary">⭐ Destacados</span>
          </label>
        </div>
      </div>

      <!-- Results count -->
      <p class="text-[11px] text-brand-secondary/60 mt-4 font-medium" aria-live="polite">
        {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados' }}
        <template v-if="totalPages > 1"> · Página {{ currentPage }} de {{ totalPages }}</template>
      </p>
    </div>

    <!-- ── Products Grid ── -->
    <div v-if="pagedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <article
        v-for="producto in pagedProducts"
        :key="producto.sku"
        class="group bg-brand-surface border border-brand-border hover:border-brand-accent/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
      >
        <!-- Image -->
        <div class="relative overflow-hidden bg-brand-background aspect-[4/3]">
          <img
            v-if="producto.mainImage"
            :src="producto.mainImage"
            :alt="producto.title"
            loading="lazy"
            width="400"
            height="300"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full flex items-center justify-center" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-12 h-12 text-brand-secondary/20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
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
                :href="`/productos/${producto._sys.relativePath.replace(/\.json$/, '')}`"
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
    </div>

    <!-- ── Empty State ── -->
    <div v-else class="text-center py-20 bg-brand-surface border border-brand-border rounded-2xl shadow-sm">
      <div class="inline-flex p-4 bg-brand-background rounded-full text-brand-secondary/40 mb-4" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-brand-primary">Sin resultados</h3>
      <p class="text-brand-secondary text-sm mt-1 max-w-xs mx-auto">Ajusta los filtros o realiza una búsqueda diferente.</p>
    </div>

    <!-- ── Pagination ── -->
    <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4" aria-label="Paginación del catálogo">
      <!-- Prev -->
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

      <!-- First page if not visible -->
      <template v-if="visiblePages[0] > 1">
        <button @click="goToPage(1)" class="w-9 h-9 rounded-xl border border-brand-border text-sm font-bold text-brand-secondary hover:bg-brand-surface hover:text-brand-primary transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none" aria-label="Ir a página 1">1</button>
        <span v-if="visiblePages[0] > 2" class="text-brand-secondary text-sm px-1">…</span>
      </template>

      <!-- Page Buttons -->
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

      <!-- Last page if not visible -->
      <template v-if="visiblePages[visiblePages.length - 1] < totalPages">
        <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="text-brand-secondary text-sm px-1">…</span>
        <button @click="goToPage(totalPages)" :aria-label="`Ir a página ${totalPages}`" class="w-9 h-9 rounded-xl border border-brand-border text-sm font-bold text-brand-secondary hover:bg-brand-surface hover:text-brand-primary transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:outline-none">{{ totalPages }}</button>
      </template>

      <!-- Next -->
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
