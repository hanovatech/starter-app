import { writable, derived } from 'svelte/store';
import { SUPPORTED_LOCALES } from '$lib/types/i18n';
import { getTranslations } from '$lib/i18n';
import type { Locale, Translations } from '$lib/types/i18n';

export const locale = writable<Locale>(SUPPORTED_LOCALES[0]);
export const translations = writable<Translations>(getTranslations(SUPPORTED_LOCALES[0]));

export function setTranslations(trans: Translations) {
  translations.set(trans);
}

export const t = derived(translations, ($translations) => {
  return $translations;
});
