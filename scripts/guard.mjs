#!/usr/bin/env node
/**
 * guard.mjs — Mobiliade Admin code quality gate
 *
 * Runs all validation steps sequentially and reports a unified summary.
 * Exit code 0 = all checks passed. Exit code 1 = one or more checks failed.
 *
 * Usage:
 *   npm run guard:all              # run all checks
 *   npm run guard:types            # typecheck only
 *   npm run guard:lint             # lint only
 *   npm run guard:test             # tests only
 *
 *   node scripts/guard.mjs --only lint
 *
 * Steps (in order):
 *   1. typecheck  — tsc --project tsconfig.src.json
 *   2. lint       — eslint src/ --ext .ts,.tsx
 *   3. test       — vitest --run
 */

import { execSync } from "child_process";
import { performance } from "perf_hooks";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── ANSI helpers ────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bgGreen: "\x1b[42m\x1b[30m",
  bgRed: "\x1b[41m\x1b[97m",
};

const ok = `${c.green}✔${c.reset}`;
const fail = `${c.red}✘${c.reset}`;
const skip = `${c.yellow}–${c.reset}`;

function label(text) {
  return `${c.bold}${c.cyan}${text}${c.reset}`;
}

function badge(passed) {
  return passed
    ? `${c.bgGreen}  PASS  ${c.reset}`
    : `${c.bgRed}  FAIL  ${c.reset}`;
}

function hr() {
  return `${c.dim}${"─".repeat(60)}${c.reset}`;
}

// ─── Step definitions ────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "typecheck",
    name: "TypeScript",
    description: "tsc --project tsconfig.src.json",
    cmd: "npx tsc --project tsconfig.src.json",
  },
  {
    id: "lint",
    name: "ESLint",
    description: "eslint src/ --ext .ts,.tsx",
    cmd: "npx eslint src --ext .ts,.tsx --max-warnings 0",
  },
  {
    id: "test",
    name: "Vitest",
    description: "vitest --run",
    cmd: "npx vitest --run",
  },
];

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const onlyIndex = args.indexOf("--only");
const onlyStep = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

const stepsToRun = onlyStep
  ? STEPS.filter((s) => s.id === onlyStep)
  : STEPS;

if (onlyStep && stepsToRun.length === 0) {
  console.error(
    `${fail} Unknown step "${onlyStep}". Valid: ${STEPS.map((s) => s.id).join(", ")}`
  );
  process.exit(1);
}

// ─── Runner ──────────────────────────────────────────────────────────────────
const results = [];

console.log();
console.log(`${c.bold}${c.cyan}  Mobiliade Admin — Code Quality Gate${c.reset}`);
console.log(hr());
console.log();

for (const step of stepsToRun) {
  process.stdout.write(
    `  ${label(step.name.padEnd(14))} ${c.dim}${step.description}${c.reset} … `
  );

  const t0 = performance.now();
  let passed = false;
  let output = "";

  try {
    output = execSync(step.cmd, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    passed = true;
  } catch (err) {
    output = [err.stdout, err.stderr].filter(Boolean).join("\n");
    passed = false;
  }

  const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
  console.log(`${passed ? ok : fail}  ${c.dim}${elapsed}s${c.reset}`);

  results.push({ step, passed, output: output.trim(), elapsed });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
const allPassed = results.every((r) => r.passed);
const skippedSteps = STEPS.filter((s) => !stepsToRun.find((r) => r.id === s.id));

console.log();
console.log(hr());
console.log();
console.log(`  ${badge(allPassed)}  ${c.bold}Summary${c.reset}`);
console.log();

for (const { step, passed, elapsed } of results) {
  console.log(`    ${passed ? ok : fail}  ${step.name.padEnd(14)} ${c.dim}${elapsed}s${c.reset}`);
}

if (skippedSteps.length > 0) {
  const names = skippedSteps.map((s) => s.name).join(", ");
  console.log(`    ${skip}  ${c.dim}Skipped: ${names}${c.reset}`);
}

console.log();

// ─── Failure details ─────────────────────────────────────────────────────────
const failures = results.filter((r) => !r.passed);

if (failures.length > 0) {
  console.log(hr());
  console.log();
  console.log(`  ${c.bold}${c.red}Failure details${c.reset}`);
  console.log();

  for (const { step, output } of failures) {
    console.log(`  ${fail} ${c.bold}${step.name}${c.reset}`);
    console.log();

    const lines = output.split("\n");
    for (const line of lines) {
      console.log(`    ${c.dim}${line}${c.reset}`);
    }

    console.log();
  }
}

process.exit(allPassed ? 0 : 1);
