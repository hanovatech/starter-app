# New Project Setup — Agent Playbook

**Audience:** an AI coding agent (e.g. Claude Code) bootstrapping a brand-new client
application from the `hanovatech/starter-app` template.

Work through the steps **in order**. Each step says what to do and how to verify it.
When everything is done, complete the final step — **delete this file** — so it does not
linger in the client project.

> **Why this file exists:** creating a repo from a GitHub _template_ copies only the
> files and directory structure — **not** repository settings. Branch protection, the
> merge-method configuration, secrets, and Actions permissions all start at GitHub's
> defaults and must be re-applied here. Steps 1–2 close that gap.

---

## 0. Confirm context

Run these and confirm you are in the new client repo, not the template itself:

```bash
gh repo view --json nameWithOwner,isTemplate -q '.nameWithOwner, .isTemplate'
git remote -v
```

- The `nameWithOwner` must be the **new** project (e.g. `hanovatech/acme-app`), not
  `hanovatech/starter-app`.
- `isTemplate` should be `false`. If it is `true`, you are in the template — stop.

If the repo does not exist yet, create it from the template first:

```bash
gh repo create hanovatech/<client>-app \
  --template hanovatech/starter-app \
  --private --clone
cd <client>-app
```

---

## 1. Apply branch protection to `main`

These settings do **not** come from the template. Apply them with the repo's own slug:

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

gh api -X PUT "repos/$REPO/branches/main/protection" \
  -H "Accept: application/vnd.github+json" \
  -d '{
    "required_status_checks": { "strict": true, "contexts": ["check"] },
    "enforce_admins": false,
    "required_pull_request_reviews": { "required_approving_review_count": 0 },
    "restrictions": null,
    "required_linear_history": true,
    "allow_force_pushes": false,
    "allow_deletions": false
  }'
```

This enforces: PR required, the CI `check` job must pass and the branch must be current,
linear history, no force-pushes or deletions. Admins can still bypass in emergencies
(`enforce_admins: false`).

> **Org-wide alternative (set once, applies to every new repo):** because `hanovatech`
> is a GitHub organization, you can instead define an **organization ruleset** (Org →
> Settings → Rules → Rulesets) targeting a name pattern such as `*-app`. It enforces the
> same protections automatically on all matching repos, so you never run the command
> above per project. The org ruleset cannot set the merge-method, so Step 2 is still
> needed per repo. If an org ruleset already covers this repo, skip the command above.

Verify:

```bash
gh api "repos/$REPO/branches/main/protection" -q '.required_linear_history.enabled, .required_pull_request_reviews, .required_status_checks.contexts'
```

## 2. Restrict the merge method to rebase-only

The repo defaults to allowing all three merge methods. The convention is rebase-only
(see CLAUDE.md → Development Workflow), so disable the others:

```bash
gh repo edit "$REPO" \
  --enable-merge-commit=false \
  --enable-squash-merge=false \
  --enable-rebase-merge=true
```

---

## 3. Install dependencies

```bash
npm install
```

The `postinstall` hook runs `svelte-kit sync && prisma generate` automatically, so the
generated Prisma client and SvelteKit types are ready afterwards — no extra step needed.

## 4. Configure the environment

```bash
cp .env.example .env
```

Fill in `.env` with the project's real credentials (database, S3, Postmark, `AUTH_SECRET`,
etc.). Ask the human for any values you cannot derive.

## 5. Set up the database

```bash
npx prisma migrate dev --name init
npm run seed
```

---

## 6. Rebrand from "template" to this client project

The template ships with generic identity. Update it:

- [ ] `package.json` → set `name` to the client project's slug
- [ ] `CLAUDE.md` → rewrite the **"What This Is"** section: this is no longer the starter
      template, it is the `<client>` application. Keep all the convention sections.
- [ ] `README.md` → replace the template-facing README with a project README (purpose,
      local setup, deploy notes). Remove template-only sections such as "Starting a New
      Client Project", "Updating Components", and the link to this file.
- [ ] `src/lib/i18n/en.json` and `de.json` → set `app.appName` and `app.title`
- [ ] `prisma/seed.ts` → set the correct admin email
- [ ] `prisma/schema.prisma` → add the project's domain models (follow the Prisma
      conventions in CLAUDE.md)
- [ ] `UserRole` enum + `ALLOWED_ROLES` in `src/hooks.server.ts` → adjust if the project
      needs different roles than ADMIN / EDITOR / UNKNOWN
- [ ] Add route groups under `src/routes/(app)/` for the app's sections

## 7. Verify the project is healthy

```bash
npm run lint    # prettier + eslint
npm run check   # svelte-check
npm run dev     # boots on http://localhost:5173
```

All three must pass before you continue building features.

## 8. Adopt the development workflow

From here on, follow the conventions in **CLAUDE.md → Development Workflow** and
**Commit Conventions**: branch off `main`, make atomic Conventional Commits, open a PR,
let CI run, and merge with **rebase**. Never commit directly to `main` (Step 1 blocks it).

## 9. Clean up

This playbook has served its purpose. Remove it so it does not confuse future readers:

```bash
git checkout -b chore/remove-bootstrap-guide
git rm docs/NEW-PROJECT-SETUP.md
git commit -m "chore: remove new-project bootstrap guide"
# open a PR and merge it via rebase
```
