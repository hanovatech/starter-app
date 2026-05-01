import { isDevMode } from '$lib/stores/appModeStore';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  return {
    appMode: isDevMode() ? 'dev' : 'production'
  };
};
