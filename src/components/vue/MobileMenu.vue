<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useFocusTrap } from '../../composables/useFocusTrap';

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

function close() {
  isOpen.value = false;
}

useFocusTrap(isOpen, containerRef, { onEscape: close });

// Lock body scroll mientras el menú está abierto
watch(isOpen, async (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) await nextTick();
});

// Escucha los eventos globales del burger button
function onOpenEvent() {
  isOpen.value = true;
}
function onCloseEvent() {
  isOpen.value = false;
}

onMounted(() => {
  window.addEventListener('open-mobile-menu', onOpenEvent);
  window.addEventListener('close-mobile-menu', onCloseEvent);
});

onUnmounted(() => {
  window.removeEventListener('open-mobile-menu', onOpenEvent);
  window.removeEventListener('close-mobile-menu', onCloseEvent);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        @click="close"
        aria-hidden="true"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <nav
        v-if="isOpen"
        ref="containerRef"
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        class="fixed inset-x-0 bottom-0 z-[70] bg-brand-surface border-t border-brand-border rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div class="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div class="w-10 h-1 rounded-full bg-brand-border"></div>
        </div>

        <div class="flex items-center justify-between px-6 py-3 border-b border-brand-border">
          <h2 class="text-base font-black text-brand-primary">Menú</h2>
          <button
            type="button"
            @click="close"
            aria-label="Cerrar menú"
            class="p-2 rounded-lg text-brand-secondary hover:bg-brand-background hover:text-brand-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul role="list" class="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <slot />
        </ul>
      </nav>
    </Transition>
  </Teleport>
</template>
