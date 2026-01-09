# Technical Optimization Log (December 2025)

## 📌 Overview
Major codebase cleanup performed to improve build performance, reduce bundle size, and fix Vercel deployment issues.

## 🧹 1. Dependency Cleanup
We removed over **20 unused libraries** that were leftovers from the initial scaffold or unused features.

### Removed Libraries:
*   **Visual/UI:** `recharts`, `embla-carousel-react`, `react-day-picker`
*   **Radix UI Primitives (Unused):**
    *   `@radix-ui/react-accordion`
    *   `@radix-ui/react-menubar`
    *   `@radix-ui/react-context-menu`
    *   `@radix-ui/react-hover-card`
    *   `@radix-ui/react-toggle`
    *   ...and others (see `package.json` diff for full list).
*   **Dev Dependencies:** Removed duplicate `resend` and `@supabase/supabase-js`.

## 🗑️ 2. File Deletions
Approximately **27 component files** were deleted from `client/src/components/ui/` because the corresponding Radix libraries were uninstalled.

**⚠️ Note for Developers:**
If you need to use a component like `Accordion` or `Menubar` in the future, you must reinstall it properly:
```bash
npx shadcn@latest add accordion
```

## 🛠️ 3. Build System Fixes

### A. Lockfile Reset
*   **Action:** `pnpm-lock.yaml` and `package-lock.json` were removed from the repository.
*   **Reason:** Sync issues between `package.json` removal and the lockfile caused Vercel builds to fail (`ERR_PNPM_OUTDATED_LOCKFILE`).
*   **Result:** The build system now generates a fresh dependency tree.

### B. Output Directory Config
*   **Action:** Removed `--outDir dist` from the `build` script in `package.json`.
*   **Reason:**
    *   `vite.config.ts` sets `root: "client"`.
    *   Running `vite build` from root used `root: client`, so `--outDir dist` created `client/dist`.
    *   Vercel expects artifacts in the project root (`dist`).
*   **Fix:** We now rely on `vite.config.ts` which correctly sets `outDir` to `../dist` (project root).

## ✅ Verification
*   `npm run build` (or `vite build`) should now verify correctly locally.
*   Vercel deployment pipeline is green.
