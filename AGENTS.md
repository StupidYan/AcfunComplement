# Repository Guidelines

## Project Structure & Module Organization

This is a dependency-free Tampermonkey userscript. Source modules live under `src/` and are concatenated by `build.js` in the exact order listed in `build.manifest.json`.

- `src/meta.user.js` — userscript metadata.
- `src/core/` — bootstrap, storage, HTTP, events, and shared utilities.
- `src/extractors/` — page and data extraction logic.
- `src/features/` — blocking, sync, tagging, recovery, and feature tasks.
- `src/ui/` — assistant UI, settings, and page controls.
- `src/legacy/` — preserved webpack/IIFE scaffolding; do not refactor it.
- `dist/acfunBlock-opensource.user.js` — generated build output.
- `acfunBlock-opensource.user.js` — committed release/install copy.
- `baseline/`, `tools/` — historical comparison and one-time migration files.

Modules are plain fragments concatenated into one shared IIFE. Do not add `import`/`export` statements. A new module must be registered in `build.manifest.json` at a semantically correct position.

## Build, Test, and Development Commands

```bash
node build.js                                  # Concatenate manifest modules into dist/
node --check dist/acfunBlock-opensource.user.js # Validate generated JavaScript syntax
git diff --check                                # Check whitespace errors
```

After validation, synchronize the release copy when appropriate:

```bash
cp dist/acfunBlock-opensource.user.js acfunBlock-opensource.user.js
```

There is no package manager configuration or automated test suite. Browser verification with Tampermonkey on `www.acfun.cn` is required for behavior changes.

## Coding Style & Naming Conventions

- Use JavaScript with 4-space indentation increments; existing module fragments start inside the shared IIFE at 8 spaces.
- Preserve surrounding style, semicolons, `camelCase` names, and Chinese user-facing strings.
- Prefer existing utilities and native APIs. Adding runtime dependencies is not expected.
- Avoid unrelated formatting, especially in `src/legacy/` and generated files.

## Testing Guidelines

Run the build and syntax check for every change. For UI, extraction, blocking, sync, or storage changes, install the generated userscript in Tampermonkey and verify the affected AcFun page plus one related page. Describe the browsers and pages tested in the pull request. For bug fixes, include reproducible before/after behavior.

## Commit & Pull Request Guidelines

Git history has no formal Conventional Commits rule. Recent meaningful subjects use concise Chinese summaries with an optional version, for example `工程化重构:... (3.064)` or `3.060 fix`. Keep subjects specific and include the userscript version for release-affecting changes.

Pull requests should explain the behavior change, list manifest/module changes, link related issues, show verification commands and browser results, and include screenshots or short recordings for UI changes. Source and committed build output must remain consistent.

## Security & Configuration Tips

Do not commit tokens, cookies, account data, or API keys. Changes involving cloud sync, IndexedDB, comment recovery, or external requests must state their privacy impact and preserve existing user consent behavior.
