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
  <button
    @click="toggleTheme"
    aria-label="Alternar tema día/noche"
    class="w-10 h-10 flex items-center justify-center rounded-xl border border-brand-border bg-brand-surface hover:bg-brand-background text-brand-primary hover:text-brand-accent transition-all duration-300 focus:outline-none cursor-pointer transform hover:scale-105 active:scale-95 shadow-sm"
  >
    <!-- Sun Icon (Visible in Dark Mode to switch to Light) -->
    <svg
      v-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.8"
      stroke="currentColor"
      class="w-5 h-5 text-yellow-400 transition-transform duration-500 rotate-45 hover:rotate-90"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
    
    <!-- Moon Icon (Visible in Light Mode to switch to Dark) -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.8"
      stroke="currentColor"
      class="w-5 h-5 text-slate-700 transition-transform duration-500 hover:-rotate-12"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  </button>
</template>