<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};
</script>

<template>
  <button @click="toggleTheme" class="p-2 rounded-lg border border-brand-border bg-brand-surface hover:bg-brand-border transition-colors duration-200 focus:outline-none">
    <span v-if="isDark" class="text-yellow-400">☀️ Día</span>
    <span v-else class="text-brand-primary">🌙 Noche</span>
  </button>
</template>