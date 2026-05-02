import { signOut } from '$lib/utils/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = { default: signOut };

export const load: PageServerLoad = async () => {
  throw redirect(302, '/login');
};
