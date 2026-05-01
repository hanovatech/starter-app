import type { Session } from '@auth/sveltekit';
import type { User, UserRole, UserLocale } from '$lib/generated/prisma/client';

declare global {
  namespace App {
    interface Locals {
      session?: Session;
      locale: UserLocale;
    }
    interface PageData {
      appMode: 'dev' | 'production';
    }
  }
}

declare module '@auth/core/types' {
  interface Session {
    user: Omit<User, 'createdAt' | 'updatedAt'> & {
      role: UserRole;
      locale: UserLocale;
    };
  }
}

export {};

declare module '$app/paths' {
  export function resolve(path: string): string;
}
