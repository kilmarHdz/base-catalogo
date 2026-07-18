<script setup lang="ts">
import { ref, computed } from 'vue';
import { getWeb3FormsKey, isWeb3FormsConfigured } from '../../config/env';

const accessKey = getWeb3FormsKey();
const isConfigured = isWeb3FormsConfigured();

type Status = 'idle' | 'sending' | 'success' | 'error';

const form = ref({
  nombre: '',
  email: '',
  empresa: '',
  asunto: '',
  mensaje: '',
  botcheck: '',
});

const status = ref<Status>('idle');
const errorMessage = ref('');

const isValid = computed(() => {
  return form.value.nombre.trim() && form.value.email.trim() && form.value.asunto && form.value.mensaje.trim();
});

const submit = async () => {
  if (!isValid.value) {
    status.value = 'error';
    errorMessage.value = 'Por favor, completa todos los campos requeridos.';
    return;
  }
  if (form.value.botcheck) return;

  if (!accessKey || !isConfigured) {
    status.value = 'error';
    errorMessage.value = 'El formulario no está configurado. Define PUBLIC_WEB3FORMS_KEY en .env. Ver .env.example.';
    return;
  }

  status.value = 'sending';
  errorMessage.value = '';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[Catálogo Base] ${form.value.asunto}`,
        from_name: form.value.nombre,
        replyto: form.value.email,
        nombre: form.value.nombre,
        email: form.value.email,
        empresa: form.value.empresa || 'No indicada',
        asunto: form.value.asunto,
        mensaje: form.value.mensaje,
        botcheck: form.value.botcheck,
      }),
    });

    const data = await response.json();

    if (data.success) {
      status.value = 'success';
      form.value = { nombre: '', email: '', empresa: '', asunto: '', mensaje: '', botcheck: '' };
    } else {
      status.value = 'error';
      errorMessage.value = data.message || 'No se pudo enviar el mensaje. Inténtalo de nuevo.';
    }
  } catch (err) {
    status.value = 'error';
    errorMessage.value = 'Error de conexión. Verifica tu red e inténtalo de nuevo.';
  }
};
</script>

<template>
  <div>
    <form
      v-if="status !== 'success'"
      class="space-y-5"
      @submit.prevent="submit"
      novalidate
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="nombre" class="text-xs font-black uppercase tracking-wider text-brand-secondary">
            Nombre Completo <span class="text-brand-accent" aria-label="requerido">*</span>
          </label>
          <input
            v-model="form.nombre"
            type="text"
            id="nombre"
            name="nombre"
            required
            autocomplete="name"
            placeholder="Juan Pérez…"
            class="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:border-brand-accent transition-all duration-200 text-sm"
          />
        </div>
        <div class="space-y-1.5">
          <label for="email" class="text-xs font-black uppercase tracking-wider text-brand-secondary">
            Email <span class="text-brand-accent" aria-label="requerido">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            name="email"
            required
            autocomplete="email"
            spellcheck="false"
            placeholder="juan@empresa.com…"
            class="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:border-brand-accent transition-all duration-200 text-sm"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="empresa" class="text-xs font-black uppercase tracking-wider text-brand-secondary">
          Empresa / Negocio
        </label>
        <input
          v-model="form.empresa"
          type="text"
          id="empresa"
          name="empresa"
          autocomplete="organization"
          placeholder="Nombre de tu restaurante o empresa…"
          class="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:border-brand-accent transition-all duration-200 text-sm"
        />
      </div>

      <div class="space-y-1.5">
        <label for="asunto" class="text-xs font-black uppercase tracking-wider text-brand-secondary">
          Asunto <span class="text-brand-accent" aria-label="requerido">*</span>
        </label>
        <select
          v-model="form.asunto"
          id="asunto"
          name="asunto"
          required
          class="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:border-brand-accent transition-all duration-200 text-sm appearance-none cursor-pointer"
        >
          <option value="" disabled>Selecciona un motivo…</option>
          <option value="cotizacion">Solicitar cotización mayorista</option>
          <option value="producto">Consulta sobre un producto</option>
          <option value="pedido">Seguimiento de pedido</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div class="space-y-1.5">
        <label for="mensaje" class="text-xs font-black uppercase tracking-wider text-brand-secondary">
          Mensaje <span class="text-brand-accent" aria-label="requerido">*</span>
        </label>
        <textarea
          v-model="form.mensaje"
          id="mensaje"
          name="mensaje"
          rows="4"
          required
          placeholder="Cuéntanos tu necesidad: productos que te interesan, cantidades aproximadas, frecuencia de pedido…"
          class="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:border-brand-accent transition-all duration-200 text-sm resize-none"
        ></textarea>
      </div>

      <input
        v-model="form.botcheck"
        type="checkbox"
        name="botcheck"
        class="hidden"
        tabindex="-1"
        autocomplete="off"
      />

      <button
        type="submit"
        :disabled="status === 'sending'"
        :aria-busy="status === 'sending'"
        class="w-full py-4 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white font-extrabold shadow-lg shadow-brand-accent/20 hover:shadow-xl hover:-translate-y-px transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        <span v-if="status === 'sending'" class="inline-flex items-center gap-2">
          <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
            <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          Enviando…
        </span>
        <span v-else>Enviar Solicitud</span>
      </button>
    </form>

    <div
      v-else
      class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-3"
      role="status"
      aria-live="polite"
    >
      <p class="text-3xl" aria-hidden="true">✅</p>
      <p class="font-extrabold text-brand-primary text-base">¡Mensaje enviado con éxito!</p>
      <p class="text-brand-secondary text-xs">Te responderemos en menos de 24&nbsp;horas hábiles.</p>
      <button
        @click="status = 'idle'"
        class="text-xs font-bold text-brand-accent hover:text-brand-accent/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 rounded"
      >
        Enviar otro mensaje
      </button>
    </div>

    <p
      v-if="status === 'error' && errorMessage"
      class="mt-4 text-xs text-red-500 font-semibold text-center"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
