import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Defense in depth: hooks.server.ts already guards the (app) route group,
// but we re-check here so the user object is guaranteed in PageData.
export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.session?.user;
  if (!user) throw redirect(302, '/login');
  if (user.role === 'UNKNOWN') throw redirect(302, '/unknown-user');

  return { user };
};
