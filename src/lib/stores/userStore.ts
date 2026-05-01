import { writable } from 'svelte/store';
import type { User } from '$lib/generated/prisma/client';

export default writable<User | null>(null);
