<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

npm (lockfile is `package-lock.json`), no monorepo, **no test runner and no CI**.

- `npm run dev` — dev server; rewrites the generated block above (commit it, don't fight it)
- `npm run build` — runs Turbopack build **and** TypeScript; does **not** run ESLint
- `npx tsc --noEmit` — typecheck (no `typecheck` script; currently passes)
- `npm run lint` — flat config `eslint.config.mjs`

**Lint currently exits 1 on pre-existing shadcn scaffold code**, not your changes: `react-hooks/set-state-in-effect` errors in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`, plus an unused-`Image` warning in `src/app/page.tsx`. Verify with `npx tsc --noEmit` + `npm run build` if you didn't touch those files.

Suggested order: `npx tsc --noEmit` → `npm run lint` → `npm run build`.

## Stack (Next 16.4.4, React 19.3, Tailwind 4)

Single App Router app; entrypoints are `src/app/layout.tsx` and `src/app/page.tsx` (still a placeholder). Path alias `@/*` → `./src/*`.

- `next.config.ts` enables **`cacheComponents`** — route segment configs `dynamic`, `revalidate`, `fetchCache` are replaced by `"use cache"` / `cacheLife`; don't copy old caching examples (see `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`). Also on: `partialPrefetching`, `reactCompiler`, `experimental.agentFeedback`.
- React Compiler is active: avoid `useMemo`/`useCallback`/`React.memo` churn and check the local docs for compiler rules.
- Root layout keeps the Next 16 typed signature `function RootLayout({ children }: LayoutProps<"/">)` — preserve it when editing.
- Docs live **in-repo** at `node_modules/next/dist/docs/` (versioned to 16.4.4). Prefer them over README/web docs; the root `README.md` is stock create-next-app boilerplate.

## shadcn / Tailwind quirks

- `components.json` style is **`base-nova`**: components wrap `@base-ui/react`, **not** `@radix-ui/react-*`. Add/refresh components with `npx shadcn add <name>`; `src/components/ui/*` are vendored copies — prefer regeneration over hand-editing.
- `cn` is the **`cn` npm package**, re-exported from `src/lib/utils.ts` — it is not the usual `clsx` + `tailwind-merge` implementation; don't "fix" it back.
- Tailwind 4 is CSS-first: no `tailwind.config.*`. Theme/imports live in `src/app/globals.css` (`@import "tailwindcss"` + `shadcn/tailwind.css`); CSS is compiled via the `@tailwindcss/turbopack` loader rule in `next.config.ts` — keep that rule if you touch bundler config.

## Environment

Windows + PowerShell; the repo path contains parentheses, so quote it in any command that `cd`s there.
