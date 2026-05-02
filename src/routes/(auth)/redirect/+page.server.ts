import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.session?.user;

  if (!user) throw redirect(302, '/login');

  // CUSTOMIZE: route users to their role-specific landing page.
  switch (user.role) {
    case 'ADMIN':
    case 'EDITOR':
      throw redirect(302, '/admin');
    case 'UNKNOWN':
    default:
      throw redirect(302, '/unknown-user');
  }
};
