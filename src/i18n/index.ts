export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Language = keyof typeof languages;
export const defaultLanguage: Language = 'es';
