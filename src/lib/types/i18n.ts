import type EN from '$lib/i18n/en.json';

export const SUPPORTED_LOCALES = ['DE', 'EN'] as const;

export type Locale = 'DE' | 'EN';
export type Translations = typeof EN;
