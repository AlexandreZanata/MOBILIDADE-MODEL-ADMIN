# Quality Gate — `guard:all`

> Unified code quality runner for Mobiliade Admin.
> Covers TypeScript type checking, ESLint static analysis, and Vitest unit tests
> in a single command with a clear pass/fail summary.

---

## Quick Start

```bash
npm run guard:all       # run all three checks
npm run guard:types     # TypeScript only
npm run guard:lint      # ESLint only
npm run guard:test      # Vitest only
```

All commands exit with code `0` on success and `1` on any failure.

---

## How It Works

The guard is a plain Node.js script (`scripts/guard.mjs`) that runs each check
as a child process, captures stdout/stderr, and prints a unified summary with
per-step timing.

```
scripts/guard.mjs
  │
  ├── Step 1 — TypeScript   npx tsc --project tsconfig.src.json
  ├── Step 2 — ESLint       npx eslint src next.config.ts vitest.config.ts
  └── Step 3 — Vitest       npx vitest --run
```

On failure, the full output of every failing step is printed below the summary
so you can diagnose without re-running each tool manually.

---

## Steps

### 1. TypeScript (`guard:types`)

```bash
npx tsc --project tsconfig.src.json
```

Uses `tsconfig.src.json` instead of the root `tsconfig.json`.
This scopes the check to `src/` only and excludes `.next/` (which may contain
stale generated types from previous builds).

**Fails on:** any type error in `src/**/*.ts` or `src/**/*.tsx`.

---

### 2. ESLint (`guard:lint`)

```bash
npx eslint src next.config.ts vitest.config.ts --max-warnings 0
```

Lints the entire project source including root config files.
Zero warnings are allowed — every warning is treated as an error.

**Scope:**

| Path               | Why included                          |
|--------------------|---------------------------------------|
| `src/`             | All application source code           |
| `next.config.ts`   | Next.js configuration                 |
| `vitest.config.ts` | Test runner configuration             |

**Excluded from lint** (via `eslint.config.mjs` `ignores`):

| Path                          | Reason                                 |
|-------------------------------|----------------------------------------|
| `.next/**`                    | Generated build output                 |
| `node_modules/**`             | Third-party code                       |
| `public/mockServiceWorker.js` | MSW-generated service worker           |
| `scripts/**`                  | Plain JS tooling scripts (no TS types) |
| `postcss.config.mjs`          | Plain JS config                        |
| `eslint.config.mjs`           | Self-referential — would cause loops   |

**Active rules:**

| Rule                                 | Level      | Notes                              |
|--------------------------------------|------------|------------------------------------|
| `@typescript-eslint/no-explicit-any` | error      | Zero `any` policy                  |
| `@typescript-eslint/no-unused-vars`  | error      | Prefix `_` to intentionally ignore |
| `no-console`                         | warn→error | Only `console.warn/error` allowed  |
| `react/react-in-jsx-scope`           | off        | React 17+ JSX transform            |
| `react/prop-types`                   | off        | TypeScript handles prop types      |
| `react-hooks/rules-of-hooks`         | error      | Hooks must follow the rules        |
| `react-hooks/exhaustive-deps`        | warn→error | All hook deps must be declared     |

---

### 3. Vitest (`guard:test`)

```bash
npx vitest --run
```

Runs all tests once (no watch mode). Uses `jsdom` environment and global
test APIs (`describe`, `it`, `expect`, `vi`).

**Fails on:** any test failure or uncaught error during test execution.

---

## Configuration Files

| File                | Purpose                                                |
|---------------------|--------------------------------------------------------|
| `scripts/guard.mjs` | Guard runner — orchestrates all steps                  |
| `eslint.config.mjs` | ESLint 9 flat config (typescript-eslint + react)       |
| `tsconfig.src.json` | Src-scoped TypeScript config (extends `tsconfig.json`) |
| `vitest.config.ts`  | Vitest config (jsdom, globals, path aliases)           |

---

## Running a Single Step

Use `--only <step>` when you want to isolate one check:

```bash
node scripts/guard.mjs --only lint
node scripts/guard.mjs --only typecheck
node scripts/guard.mjs --only test
```

Valid step IDs: `typecheck`, `lint`, `test`.

---

## CI Integration

The guard script is designed to be dropped directly into any CI pipeline.
It exits `0` on full pass and `1` on any failure, which is the standard
convention for CI step success/failure.

Example GitHub Actions step:

```yaml
- name: Quality gate
  run: npm run guard:all
```

---

## Adding a New Rule

1. Open `eslint.config.mjs`
2. Add the rule to the project-specific block:

```js
// Project-specific rules
{
  rules: {
    "your-new-rule": "error",
  },
},
```

1. Run `npm run guard:lint` to verify it passes before committing.

---

## Suppressing a Rule (Exceptional Cases Only)

Use inline disable comments with a justification comment:

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- legacy API response shape
const raw = response as any;
```

Never use file-level `/* eslint-disable */` without a tracked ADR.
