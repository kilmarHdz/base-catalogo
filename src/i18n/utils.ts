import es from './es';
import en from './en';
import { defaultLanguage, type Language } from './index';

export const translations = { es, en } as const;
export type Translations = typeof es;

export function t(lang: Language = defaultLanguage): Translations {
  return translations[lang] as Translations;
}

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'es') return lang;
  return defaultLanguage;
}
