# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

This is the **HanovaTech Starter Template** — the base for all client projects. It contains infrastructure and conventions only, no business-specific code. Business features are added per project, either manually or via the [Feature Registry](https://hanovatech.github.io/feature-registry/).

## Commands

```bash
npm run dev            # Start dev server (http://localhost:5173)
npm run build          # Production build (output: build/)
npm run check          # svelte-check type checking
npm run lint           # Prettier + ESLint checks
npm run format         # Auto-format
npm run seed           # Seed database
npm run setup:shadcn   # (Re-)install all shadcn + registry components fresh
npx prisma migrate dev --name <name>   # Create and apply migration
npx prisma generate                    # Regenerate client after schema changes
```

## Architecture

SvelteKit 2 + Svelte 5 business application template. Base roles: **ADMIN**, **EDITOR**, **UNKNOWN**. Protected routes live under `src/routes/(app)/`.

**Data flow:**

- `+page.server.ts` load functions call the app's own API routes via `fetch` — they do **not** access Prisma directly
- Form actions in `+page.server.ts` may call Prisma directly for simple mutations
- All DB access, business logic, and Zod validation lives in `src/routes/api/`

**Key singletons** (import from these paths, never re-instantiate):

- `$lib/utils/prisma` — Prisma client
- `$lib/utils/logger` — pino logger (never use `console.log`)
- `$lib/utils/postmark` — email client
- `$lib/utils/s3` — S3 file operations
- `$lib/utils/dayjs` — dayjs with UTC plugin pre-configured (see [Date Handling](#date-handling))

## Svelte 5 Rules

Always use runes — never legacy Svelte 4 syntax:

```svelte
<script lang="ts">
  interface Props { value: string; onChange?: (v: string) => void; }
  let { value, onChange }: Props = $props();
  let count = $state(0);
  const doubled = $derived(count * 2);
  $effect(() => { /* side effects */ });
</script>
```

- Use `Snippet` (not slots) for component composition
- Never use `export let`, `$: reactive`, or `createEventDispatcher`

## API Routes

```ts
import { json, error } from '@sveltejs/kit';
import prisma from '$lib/utils/prisma';
import logger from '$lib/utils/logger';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = locals.session?.user;
  if (!user) return error(401, 'Unauthorized');
  if (user.role !== 'ADMIN') return error(403, 'Forbidden');

  const body = schema.parse(await request.json());
  logger.info({ userId: user.id }, 'POST /api/resource');
  const result = await prisma.resource.create({ data: body });
  return json(result, { status: 201 });
};
```

- `401` = not authenticated, `403` = wrong role
- Use `error()` helper, not `json({ error: '...' }, { status })`
- Always catch `ZodError` and return `error(400, 'Validation error')`
- List endpoints: paginate with `page`/`limit` params, return `PaginatedResponse<T>` from `$lib/types/api`, use `Promise.all` for `findMany` + `count`
- Soft-delete models: always filter `deletedAt: null` unless intentionally fetching deleted records

## Logging Levels

```ts
logger.debug({ userId, resourceId, path }, 'GET /api/resource/[id]'); // entry points
logger.info({ resourceId, userId }, 'Resource created'); // successful mutations
logger.warn({ userId, role }, 'Unauthorized access attempt'); // auth failures
logger.error({ err, resourceId }, 'Error creating resource'); // catch blocks
```

## Component Layers

`src/lib/components/` has three layers — only the third is editable:

1. **`ui/`** — shadcn-svelte primitives. **Do not modify.** Install via `npx shadcn-svelte add <component>`.
2. **`registry/`** — HanovaTech custom registry components (Pagination, PageHeader, SheetForm, Metrics, etc.). **Do not modify.** Install via `npx shadcn-svelte@latest add https://hanovatech.github.io/ui-registry/r/<component>.json`. Registry docs: https://hanovatech.github.io/ui-registry/llms.txt
3. **`<feature>/`** — project-specific components. Editable. Co-locate `columns.ts` + component files per feature.

```ts
import { Button } from '$lib/components/ui/button';
import * as Dialog from '$lib/components/ui/dialog';
import Pagination from '$lib/components/registry/pagination/pagination.svelte';
import PageHeader from '$lib/components/registry/page-header/page-header.svelte';
```

## Icons

Import individually — never from the barrel:

```ts
import ArrowLeft from '@lucide/svelte/icons/arrow-left'; // ✅
import { ArrowLeft } from '@lucide/svelte'; // ❌
```

## Types & Schemas

- Zod schemas live in `src/lib/types/<entity>.ts`: `create<Entity>Schema`, `update<Entity>Schema`
- Update schemas: all fields `.optional()`
- Derive TS types with `z.infer<>`, never duplicate Prisma types — extend with `interface ... extends`
- Prisma enums: `import { EnumName } from '$lib/generated/prisma/client'` and use `z.enum(EnumName)`
- Email fields: `.transform((val) => val.toLowerCase().trim())` in all schemas
- Dates: `z.coerce.date()`
- Monetary amounts use `Float`, not `Decimal`

## Prisma Schema Conventions

- Client output: `../src/lib/generated/prisma` — do not change
- Model names: PascalCase singular; table names: snake_case plural via `@@map()`
- Field names: camelCase; column names: snake_case via `@map()` — **every** camelCase field needs `@map()`
- All IDs: `id String @id @default(uuid())`; FK fields: `<modelName>Id` with `@map("<model_name>_id")`
- All models: `createdAt`/`updatedAt` timestamps at the bottom before relations
- Soft-deletable models add `deletedAt DateTime? @map("deleted_at")`
- Models with `status` field always index it: `@@index([status])`
- Enum values: `SCREAMING_SNAKE_CASE`; named relations: `"ModelA_FieldName"` format

## Date Handling

Use `dayjs` for date manipulation (not moment — it is in maintenance mode). Import the pre-configured singleton from `$lib/utils/dayjs` (UTC plugin already enabled) — never `import dayjs from 'dayjs'` directly. Always use `.utc()` when constructing date boundaries for Prisma queries:

```ts
import dayjs from '$lib/utils/dayjs';

// ✅ Correct — UTC
const monthStart = dayjs.utc().startOf('month').toDate();
const monthEnd = dayjs.utc().endOf('month').toDate();

// ❌ Wrong — local time
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
```

## i18n

Never hardcode user-facing strings. All UI text goes through `$t` from `$lib/stores/i18nStore`. New keys must be added to both `src/lib/i18n/en.json` and `src/lib/i18n/de.json`.

```svelte
<script lang="ts">
  import { t } from '$lib/stores/i18nStore';
</script>
<p>{$t.common.noData}</p>
```

## Feature Registry

Reusable backend features are available at https://hanovatech.github.io/feature-registry/. Each feature provides Prisma schema fragments, API routes, Zod types, utils, and i18n keys that get copied into the project and customized. UI components are always built project-specifically.

Available features: https://hanovatech.github.io/feature-registry/r/index.json

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/). Messages are written in **English**, in the imperative mood.

```
<type>(<optional scope>): <summary>

<optional body>

<optional footer>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `build`, `ci`.

```
feat(auth): add credentials provider
fix(api): filter soft-deleted records in resource list
chore: swap moment for dayjs
docs: document date handling convention
```

**Atomic commits** — one logical change per commit. Each commit must build and stay self-consistent on its own; never mix unrelated changes (e.g. a feature + an unrelated bugfix) in the same commit. If a commit would need two types, split it.

- Summary in lower case, no trailing period, ≤ 72 chars
- Scope is optional — use the affected area (`api`, `auth`, `prisma`, a feature name)
- Use the body to explain *why*, not *what* (the diff shows the what)
- Breaking changes: add `!` after the type/scope (`feat(api)!: ...`) or a `BREAKING CHANGE:` footer

## Keeping This File Up to Date

When making architectural changes, update this file:

- New dependency → update stack + add usage conventions
- New architectural pattern → add it here
- Prisma schema convention change → document it
- New feature installed from registry → no update needed (it's project code now)
