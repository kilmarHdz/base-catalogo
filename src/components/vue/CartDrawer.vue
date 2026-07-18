<script setup lang="ts">
import { watch } from 'vue';
import { useCart } from '../../composables/useCart';
import { useToasts } from '../../composables/useToasts';
import site from '../../config/site';

const { items, count, isOpen, removeItem, updateQuantity, clear, closeDrawer } = useCart();
const { toasts } = useToasts();

function checkout() {
  if (items.value.length === 0) return;

  let message = `${site.whatsapp.cartCheckoutPrefix}\n\n`;

  items.value.forEach((item, index) => {
    message += `${index + 1}. *${item.title}* (Cant: ${item.quantity})\n   *SKU:* \`${item.sku}\`\n   *Cat:* ${item.category || 'General'}\n\n`;
  });

  message += `¿Me podrían indicar los pasos para completar la cotización y envío?\n¡Muchas gracias!`;

  const url = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Lock body scroll cuando el drawer está abierto
watch(isOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        @click="closeDrawer"
        aria-hidden="true"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-full sm:max-w-md z-[90] bg-brand-surface/95 backdrop-blur-xl border-l border-brand-border shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div class="p-6 border-b border-brand-border flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl" aria-hidden="true">🛒</span>
            <h2 id="cart-drawer-title" class="text-lg font-black text-brand-primary">Tu Pedido</h2>
          </div>
          <button
            @click="closeDrawer"
            aria-label="Cerrar carrito"
            class="p-2 rounded-lg border border-brand-border text-brand-secondary hover:bg-brand-background hover:text-brand-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-grow overflow-y-auto p-6 space-y-4">
          <div v-if="items.length === 0" class="text-center py-20 space-y-4">
            <div class="text-4xl text-brand-secondary/35" aria-hidden="true">🛍️</div>
            <h3 class="text-base font-bold text-brand-primary">Tu carrito está vacío</h3>
            <p class="text-brand-secondary text-xs max-w-[200px] mx-auto">
              Explora el catálogo y añade tus productos favoritos para cotizar.
            </p>
          </div>

          <ul v-else class="space-y-4 divide-y divide-brand-border/40" role="list">
            <li
              v-for="item in items"
              :key="item.sku"
              class="flex items-center gap-4 pt-4 first:pt-0"
            >
              <div class="w-16 h-16 rounded-xl bg-brand-background border border-brand-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  v-if="item.mainImage"
                  :src="item.mainImage"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-brand-secondary/30" aria-hidden="true">📦</span>
              </div>

              <div class="flex-grow space-y-1">
                <h4 class="text-sm font-bold text-brand-primary line-clamp-1">{{ item.title }}</h4>
                <p class="text-[10px] font-mono text-brand-secondary">SKU: {{ item.sku }}</p>

                <div class="flex items-center gap-2 pt-1.5">
                  <button
                    @click="updateQuantity(item.sku, -1)"
                    :aria-label="`Disminuir cantidad de ${item.title}`"
                    class="w-6 h-6 rounded-md border border-brand-border bg-brand-background text-brand-secondary hover:bg-brand-border/40 flex items-center justify-center text-xs font-black transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                  >
                    −
                  </button>
                  <span
                    class="text-xs font-bold text-brand-primary w-6 text-center select-none"
                    :aria-label="`Cantidad: ${item.quantity}`"
                  >
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="updateQuantity(item.sku, 1)"
                    :aria-label="`Aumentar cantidad de ${item.title}`"
                    class="w-6 h-6 rounded-md border border-brand-border bg-brand-background text-brand-secondary hover:bg-brand-border/40 flex items-center justify-center text-xs font-black transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                @click="removeItem(item.sku)"
                :aria-label="`Eliminar ${item.title} del carrito`"
                class="p-2 rounded-lg text-brand-secondary hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <div v-if="items.length > 0" class="p-6 border-t border-brand-border bg-brand-background/40 space-y-4">
          <div class="flex items-center justify-between text-xs font-bold text-brand-secondary uppercase tracking-wider">
            <span>Artículos totales:</span>
            <span aria-live="polite">{{ count }}</span>
          </div>

          <div class="flex flex-col gap-3">
            <button
              @click="checkout"
              class="w-full py-4 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white font-bold text-sm shadow-lg shadow-brand-accent/25 hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Enviar Pedido por WhatsApp
            </button>

            <button
              @click="clear"
              class="w-full py-2.5 rounded-xl border border-brand-border hover:bg-red-500/10 hover:border-red-500/30 text-brand-secondary hover:text-red-500 text-xs font-bold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <div class="fixed top-24 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none" role="status" aria-live="polite">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="bg-brand-surface/90 border border-brand-border backdrop-blur-md text-brand-primary p-4 rounded-xl shadow-lg border-l-4 border-l-brand-accent pointer-events-auto flex items-center justify-between gap-3 text-sm font-semibold motion-safe:animate-slide-in"
        >
          <span>{{ toast.message }}</span>
          <span class="text-brand-accent font-bold" aria-hidden="true">✓</span>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slide-in {
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (prefers-reduced-motion: reduce) {
  .animate-slide-in {
    animation: none;
  }
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
