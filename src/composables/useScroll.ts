/**
 * Composable para detectar la posición y dirección del scroll.
 *
 * Usa un listener pasivo con `requestAnimationFrame` para evitar reflows.
 * Devuelve refs reactivos que se actualizan en cada frame.
 *
 * SSR-safe: en el servidor, todos los refs son 0 / 'top'.
 */

import { ref, onMounted, onUnmounted, readonly, type Ref } from 'vue';

export type ScrollDirection = 'up' | 'down' | 'top';
export type ScrollState = 'top' | 'scrolled' | 'hidden';

interface UseScrollOptions {
  /** Píxeles de scroll antes de considerar "scrolled". Default: 16 */
  threshold?: number;
  /** Píxeles de scroll antes de ocultar el navbar. Default: 200 */
  hideThreshold?: number;
}

export function useScroll(options: UseScrollOptions = {}) {
  const { threshold = 16, hideThreshold = 200 } = options;

  const scrollY: Ref<number> = ref(0);
  const direction: Ref<ScrollDirection> = ref('top');
  const state: Ref<ScrollState> = ref('top');

  let lastY = 0;
  let ticking = false;
  let mounted = false;

  function update() {
    const y = window.scrollY;
    scrollY.value = y;

    if (y <= threshold) {
      state.value = 'top';
      direction.value = 'top';
    } else if (y > lastY && y > hideThreshold) {
      state.value = 'hidden';
      direction.value = 'down';
    } else if (y < lastY) {
      state.value = 'scrolled';
      direction.value = 'up';
    } else if (y >= threshold) {
      state.value = 'scrolled';
    }

    lastY = y;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return;
    mounted = true;
    lastY = window.scrollY;
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onUnmounted(() => {
    if (!mounted || typeof window === 'undefined') return;
    window.removeEventListener('scroll', onScroll);
  });

  return {
    scrollY: readonly(scrollY),
    direction: readonly(direction),
    state: readonly(state),
  };
}
