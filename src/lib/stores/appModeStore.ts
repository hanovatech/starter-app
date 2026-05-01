import { env } from '$env/dynamic/private';

export function isDevMode(): boolean {
  return env.NODE_ENV === 'development';
}
