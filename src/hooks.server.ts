import { sequence } from '@sveltejs/kit/hooks';
import { error, redirect } from '@sveltejs/kit';
import { handle as authHandle } from '$lib/utils/auth';
import { defaultLocale } from '$lib/i18n';
import { startScheduler } from '$lib/scheduler/scheduler';
import type { Handle } from '@sveltejs/kit';

startScheduler();

const setupLocals: Handle = async ({ event, resolve }) => {
  const session = await event.locals.auth();
  if (session) event.locals.session = session;
  return resolve(event);
};

export const setupLocale: Handle = async ({ event, resolve }) => {
  event.locals.locale = event.locals.session?.user.locale || defaultLocale;
  return await resolve(event);
};

// CUSTOMIZE: Adjust allowed roles for your project
const ALLOWED_ROLES = ['ADMIN', 'EDITOR'] as const;

const guardProtectedRoutes: Handle = async ({ event, resolve }) => {
  const isApi = event.url.pathname.startsWith('/api/');
  const isApp = event.route.id?.startsWith('/(app)') ?? false;
  if (!isApi && !isApp) return resolve(event);

  const user = event.locals.session?.user;

  if (!user) {
    if (isApi) throw error(401, 'Unauthorized');
    throw redirect(302, '/login');
  }

  if (!ALLOWED_ROLES.includes(user.role as (typeof ALLOWED_ROLES)[number])) {
    if (isApi) throw error(403, 'Forbidden');
    throw redirect(302, '/unknown-user');
  }

  return resolve(event);
};

export const handle = sequence(authHandle, setupLocals, setupLocale, guardProtectedRoutes);
