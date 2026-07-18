/**
 * Composable para gestionar el tema (claro/oscuro) con persistencia.
 *
 * Aplica la clase `.dark` en `<html>` y guarda la preferencia en localStorage.
 * Compatible con SSR: durante el render server-side retorna `isDark = false`
 * y la lectura real ocurre en `onMounted` en el cliente.
 */

import { ref, onMounted, readonly, type Ref } from 'vue';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const isDark: Ref<boolean> = ref(false);

function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function persistTheme(theme: Theme): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, theme);
}

function readStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function useTheme() {
  onMounted(() => {
    isDark.value = readStoredTheme() === 'dark';
  });

  function setTheme(theme: Theme): void {
    isDark.value = theme === 'dark';
    applyTheme(theme);
    persistTheme(theme);
  }

  function toggle(): void {
    setTheme(isDark.value ? 'light' : 'dark');
  }

  return {
    isDark: readonly(isDark),
    setTheme,
    toggle,
  };
}
