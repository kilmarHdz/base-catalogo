/**
 * Composable para confinar el foco dentro de un elemento (focus trap).
 *
 * Patrón estándar de WAI-ARIA Authoring Practices:
 *   - Tab desde el último elemento enfoca el primero
 *   - Shift+Tab desde el primero enfoca el último
 *   - Escape invoca el callback `onEscape`
 *   - Al desactivar, restaura el foco al elemento previamente activo
 *
 * SSR-safe: no hace nada en el servidor.
 */

import { ref, watch, onUnmounted, type Ref } from 'vue';

export interface UseFocusTrapOptions {
  /** Se ejecuta al presionar Escape mientras el trap está activo */
  onEscape?: () => void;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap(
  isActive: Ref<boolean>,
  containerRef: Ref<HTMLElement | null>,
  options: UseFocusTrapOptions = {}
) {
  const previousFocus = ref<HTMLElement | null>(null);

  function getFocusable(): HTMLElement[] {
    const container = containerRef.value;
    if (!container) return [];
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('inert') && el.offsetParent !== null
    );
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isActive.value) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      options.onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (active === first || !containerRef.value?.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  watch(
    isActive,
    (active) => {
      if (typeof document === 'undefined') return;

      if (active) {
        previousFocus.value = document.activeElement as HTMLElement | null;
        document.addEventListener('keydown', handleKeydown);
        // Foco al primer elemento focusable del container
        requestAnimationFrame(() => {
          const focusable = getFocusable();
          focusable[0]?.focus();
        });
      } else {
        document.removeEventListener('keydown', handleKeydown);
        // Restaurar foco
        previousFocus.value?.focus();
        previousFocus.value = null;
      }
    },
    { immediate: false }
  );

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeydown);
    }
  });
}
