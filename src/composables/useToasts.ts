/**
 * Composable para gestionar notificaciones toast efímeras.
 *
 * Las toasts se auto-eliminan después de `DISMISS_AFTER_MS`. El estado es
 * global (singleton) y se consume desde el componente que renderiza el
 * contenedor (CartDrawer.vue).
 */

import { ref, readonly, type Ref } from 'vue';

const DISMISS_AFTER_MS = 3000;

export interface Toast {
  id: string;
  message: string;
}

const toasts: Ref<Toast[]> = ref([]);

function makeId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useToasts() {
  function push(message: string): string {
    const id = makeId();
    toasts.value.push({ id, message });
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
      }, DISMISS_AFTER_MS);
    }
    return id;
  }

  function dismiss(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts: readonly(toasts),
    push,
    dismiss,
  };
}
