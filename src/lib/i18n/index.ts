import EN from './en.json';
import DE from './de.json';
import { SUPPORTED_LOCALES } from '$lib/types/i18n';
import type { Locale, Translations } from '$lib/types/i18n';

export const defaultLocale: Locale = SUPPORTED_LOCALES[0];

const translations: Record<Locale, Translations> = {
  EN,
  DE
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale];
}
