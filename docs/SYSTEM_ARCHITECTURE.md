# Welux Events - Job Aggregator System Architecture

## Overview
This project includes an automated Job Aggregator system that fetches job listings from external APIs (currently Jooble) and displays them on the `/jobs` page of the Welux Events website.

## Components

### 1. Database (Supabase)
- **Table:** `public.jobs` (formerly referenced as `job_listings` in legacy docs).
- **Schema:** Defined in `supabase_jobs_schema.sql`.
- **Key Constraint:** Use `url` as a UNIQUE key to prevent duplicate listings.
- **Triggers:** A trigger (`supabase_cloudflare_trigger.sql`) calls the Cloudflare Revalidation API whenever rows are inserted, ensuring the frontend cache is fresh.

### 2. Frontend (React/Vite)
- **Page:** `client/src/pages/Jobs.tsx`.
- **Connections:** Connects directly to Supabase using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **SEO:** Uses `react-helmet-async` for dynamic meta tags.

### 3. Data Aggregation (Python)
- **Script:** `scripts/job_aggregator/job_aggregator.py`.
- **Logic:**
    - Fetches jobs from Jooble API based on keywords ("Driver, Admin, Banking...").
    - Normalizes data.
    - Uploads to Supabase via REST API.
    - Handles duplicates gracefully via HTTP 409 responses.
- **Execution:** Can be run locally or via GitHub Actions.

### 4. Automation (GitHub Actions)
- **Workflow:** `.github/workflows/update_jobs.yml`.
- **Schedule:** Runs daily at 8:00 AM UTC.
- **Secrets Required:**
    - `JOOBLE_API_KEY`
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY`

### 5. Caching & Performance (Cloudflare)
- **Trigger:** Supabase -> Cloudflare Worker (`functions/api/revalidate-jobs.ts`).
- **Logic:** When DB updates, Cloudflare purges the cache for `/jobs` to show new content immediately.

## Maintenance Notes
- **To add new job sources:** Edit `job_aggregator.py` to add a new fetch function and merge the DataFrames.
- **To update keywords:** Modify `SEARCH_KEYWORDS` in `job_aggregator.py`.
- **To run manually:**
  ```bash
  python3 scripts/job_aggregator/job_aggregator.py --upload
  ```
- **Environment Variables:** Must be set in `.env` for local dev and GitHub Secrets for CI/CD.

## Security
- **API Keys:** Never commit keys. Use `.env` locally.
- **Protection:** `.gitignore` is configured to exclude secrets and build artifacts.
