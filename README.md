# HanovaTech Starter App

Base template for all HanovaTech client projects. Contains infrastructure, conventions, and UI components — no business-specific code.

## Tech Stack

| Layer         | Technology                                          |
| ------------- | --------------------------------------------------- |
| Framework     | SvelteKit 2 (Svelte 5, runes)                       |
| Adapter       | `@sveltejs/adapter-node`                            |
| Language      | TypeScript (strict)                                 |
| Styling       | Tailwind CSS v4                                     |
| UI Components | shadcn-svelte (nova style) + HanovaTech UI Registry |
| Database      | PostgreSQL + Prisma 7                               |
| Auth          | Auth.js (magic-link via Postmark)                   |
| Email         | Postmark                                            |
| Storage       | AWS S3 (presigned uploads)                          |
| Validation    | Zod                                                 |
| Logging       | pino                                                |
| Scheduling    | node-cron                                           |
| i18n          | Custom store (DE + EN)                              |

## Starting a New Client Project

### 1. Clone this template

```bash
# Via GitHub template button, or:
gh repo create hanovatech/<client>-app --template hanovatech/starter-app --private
git clone https://github.com/hanovatech/<client>-app.git
cd <client>-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your project's database, S3, Postmark credentials
```

### 4. Set up database

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed
```

### 5. Start developing

```bash
npm run dev
```

### 6. Install features from the Feature Registry

Browse available features at https://hanovatech.github.io/feature-registry/r/index.json

```bash
# Example: fetch the documents feature JSON
curl -s https://hanovatech.github.io/feature-registry/r/documents.json | python3 -m json.tool
```

Then copy the files into the correct locations and follow the post-install steps in the feature manifest.

## Project Structure

```
src/
├── routes/
│   ├── (app)/                # Authenticated routes (add your pages here)
│   │   └── admin/            # Admin-only routes
│   ├── (public)/             # Public routes (login, legal pages)
│   └── api/                  # REST API endpoints (add your APIs here)
├── lib/
│   ├── components/
│   │   ├── ui/               # shadcn-svelte primitives (DO NOT EDIT)
│   │   ├── registry/         # HanovaTech registry components (DO NOT EDIT)
│   │   └── <feature>/        # Your project-specific components (EDIT HERE)
│   ├── generated/prisma/     # Auto-generated Prisma client
│   ├── i18n/                 # Translations (en.json, de.json)
│   ├── scheduler/            # Cron job scheduler
│   ├── stores/               # Svelte stores (i18n, user, app mode)
│   ├── types/                # TypeScript types & Zod schemas
│   └── utils/                # Singletons (prisma, logger, s3, postmark, auth)
├── hooks.server.ts           # Auth, locale, route guards
└── app.html
prisma/
├── schema.prisma             # Database schema (User, Account, Session + your models)
└── seed.ts                   # Database seeder
```

## What's Included

### Infrastructure (ready to use)

- **Auth.js** with Postmark magic-link login, role-based route guards, dev-mode console login
- **Prisma** with User/Account/Session models, snake_case conventions, UUID IDs
- **S3** client with presigned URL helpers for uploads and downloads
- **Postmark** email client singleton
- **pino** structured logging with pretty-print in dev
- **i18n** store with DE + EN translations and all common UI strings
- **node-cron** scheduler framework (add jobs as needed)

### UI Components (28 shadcn + 13 registry)

**shadcn-svelte (Layer 1):** Alert, Badge, Breadcrumb, Button, Card, Checkbox, Command, DataTable, Dialog, DropdownMenu, Input, Label, Pagination, Popover, RangeCalendar, Select, Separator, Sheet, Sidebar, Table, Tabs, Textarea, Tooltip, and more.

**HanovaTech Registry (Layer 2):** Pagination, PageHeader, SheetForm, SearchFilter, SelectFilter, Metrics, Breadcrumbs, NavigationTabs, MonthFilter, DateRangeFilter, ButtonGroupFilter, TimeInput, i18n.

### Conventions (documented in CLAUDE.md)

- Svelte 5 runes-only syntax
- API route patterns (auth, validation, pagination, error handling)
- Prisma naming conventions
- Component layer architecture
- Logging levels
- Date handling (UTC-only)

## Scripts

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start dev server (localhost:5173)                |
| `npm run build`        | Production build to `build/`                     |
| `npm run check`        | svelte-check type checking                       |
| `npm run lint`         | Prettier + ESLint                                |
| `npm run format`       | Auto-format                                      |
| `npm run seed`         | Seed database                                    |
| `npm run setup:shadcn` | Reinstall all shadcn + registry components fresh |

## Updating Components

### Reinstall all shadcn components (latest versions)

```bash
npm run setup:shadcn
```

**Important:** The `setup:shadcn` script will overwrite `src/lib/i18n/index.ts` and `src/lib/types/i18n.ts` with simplified versions from the i18n registry component. After running it, restore the multi-locale versions:

- `src/lib/i18n/index.ts` needs `defaultLocale`, `getTranslations(locale)` with DE+EN support
- `src/lib/types/i18n.ts` needs `SUPPORTED_LOCALES`, `Locale`, `Translations` exports
- `src/lib/stores/i18nStore.ts` needs `locale` writable and correct `getTranslations()` call signature

### Add a new shadcn component

```bash
npx shadcn-svelte add <component-name>
```

### Update a HanovaTech registry component

```bash
npx shadcn-svelte@latest add https://hanovatech.github.io/ui-registry/r/<component>.json --overwrite
```

## Customization Checklist for New Projects

When starting a new client project from this template:

- [ ] Update `app.appName` and `app.title` in `src/lib/i18n/en.json` and `de.json`
- [ ] Update `prisma/seed.ts` with the correct admin email
- [ ] Update `.env` with project-specific credentials
- [ ] Add domain models to `prisma/schema.prisma`
- [ ] Customize `UserRole` enum if needed (default: ADMIN, EDITOR, UNKNOWN)
- [ ] Update allowed roles in `src/hooks.server.ts` (`ALLOWED_ROLES`)
- [ ] Add route groups under `src/routes/(app)/` for your app's sections
- [ ] Install features from the Feature Registry as needed

## Related Repositories

| Repo                                                               | Purpose                                               |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| [ui-registry](https://github.com/hanovatech/ui-registry)           | Reusable UI components (shadcn-style, Layer 2)        |
| [feature-registry](https://github.com/hanovatech/feature-registry) | Backend feature templates (Prisma, API routes, types) |

## License

Proprietary — HanovaTech GmbH
