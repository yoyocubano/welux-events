
import requests
import pandas as pd
from datetime import datetime
import os
import json
import argparse
import sys

# --- CONFIGURATION ---
SEARCH_KEYWORDS = "Driver, Restaurant, Hotel, Construction"
SEARCH_LOCATION = "Luxembourg"

# Adzuna Config - Luxembourg not supported, using neighboring countries
ADZUNA_APP_ID = os.environ.get("ADZUNA_APP_ID", "99dc4fbe")
ADZUNA_APP_KEY = os.environ.get("ADZUNA_APP_KEY", "ce5288b297b36149546c4cfe5ad5d6b5")
ADZUNA_COUNTRIES = ["be", "de", "fr"]  # Belgium, Germany, France (Luxembourg's neighbors)

# Supabase Config
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://obijleonxnpsgpmqcdik.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "YOUR_SUPABASE_KEY")


def upload_to_supabase(df):
    """Uploads the dataframe to Supabase 'jobs' table via REST API."""
    if "YOUR_SUPABASE" in SUPABASE_KEY:
        print("[!] Supabase Service Role Key not configured. Skipping upload.")
        return

    print(f"[*] Uploading {len(df)} jobs to Supabase 'jobs' table...")
    
    endpoint = f"{SUPABASE_URL}/rest/v1/jobs"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    
    success_count = 0
    duplicate_count = 0
    
    for _, row in df.iterrows():
        try:
            data = {
                "title": str(row["Job Title"])[:255],
                "company": str(row["Company"])[:255] if pd.notna(row["Company"]) else "N/A",
                "location": str(row["Location"])[:255] if pd.notna(row["Location"]) else SEARCH_LOCATION,
                "url": str(row["URL"]),
                "source": str(row["Source"]),
                "date_posted": row["Date Posted"] if pd.notna(row["Date Posted"]) else datetime.now().isoformat(),
                "description": str(row["Description"])[:1000] if pd.notna(row["Description"]) else ""
            }
            
            response = requests.post(endpoint, headers=headers, json=data)
            
            if response.status_code in [200, 201, 204]:
                success_count += 1
            elif response.status_code == 409:
                duplicate_count += 1
            else:
                print(f"    [!] API Error ({response.status_code}): {response.text[:100]}")

        except Exception as e:
            print(f"    [!] Error uploading job: {e}")
            
    print(f"[✔] Uploaded {success_count} new jobs. ({duplicate_count} duplicates skipped)")


# --- ADZUNA MODULE (Searching neighboring countries) ---
def fetch_adzuna_jobs(keywords, results_per_country=10):
    """Fetches jobs from Adzuna API across Luxembourg's neighboring countries."""
    print(f"[*] Fetching jobs from Adzuna for '{keywords}'...")
    print(f"    Searching in: {', '.join([c.upper() for c in ADZUNA_COUNTRIES])}")
    
    all_jobs = []
    
    for country_code in ADZUNA_COUNTRIES:
        url = f"https://api.adzuna.com/v1/api/jobs/{country_code}/search/1"
        
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_APP_KEY,
            "results_per_page": results_per_country,
            "what": keywords,
            "content-type": "application/json"
        }

        try:
            response = requests.get(url, params=params)
            
            if response.status_code != 200:
                print(f"    [{country_code.upper()}] Error: {response.status_code}")
                continue
                
            data = response.json()
            jobs = data.get("results", [])
            print(f"    [{country_code.upper()}] Found {len(jobs)} jobs")
            
            for job in jobs:
                all_jobs.append({
                    "Job Title": job.get("title", "N/A"),
                    "Company": job.get("company", {}).get("display_name", "N/A"),
                    "Location": job.get("location", {}).get("display_name", country_code.upper()),
                    "URL": job.get("redirect_url", "#"),
                    "Source": f"Adzuna ({country_code.upper()})",
                    "Date Posted": job.get("created", None),
                    "Description": job.get("description", "")[:500] if job.get("description") else ""
                })

        except Exception as e:
            print(f"    [{country_code.upper()}] Error: {e}")
            continue
    
    print(f"    -> Total: {len(all_jobs)} jobs from all countries")
    return pd.DataFrame(all_jobs) if all_jobs else pd.DataFrame()


# --- MAIN ---
def main():
    parser = argparse.ArgumentParser(description="Aggregates jobs from Adzuna for Luxembourg region.")
    parser.add_argument("--keywords", type=str, default=SEARCH_KEYWORDS, help="Job keywords to search")
    parser.add_argument("--results", type=int, default=10, help="Results per country (max 50)")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of CSV")
    parser.add_argument("--upload", action="store_true", help="Upload results to Supabase DB")
    args = parser.parse_args()

    # Fetch from Adzuna (Belgium, Germany, France)
    df_jobs = fetch_adzuna_jobs(args.keywords, results_per_country=args.results)

    if not df_jobs.empty:
        # Deduplicate by URL
        df_jobs.drop_duplicates(subset=['URL'], keep='first', inplace=True)
        final_count = len(df_jobs)
        
        print(f"[✔] Total unique jobs found: {final_count}")

        # Export to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if args.json:
            filename = f"jobs_luxembourg_{timestamp}.json"
            df_jobs.to_json(filename, orient="records", indent=2)
            print(f"[✔] Saved {final_count} jobs to {filename}")
        else:
            filename = f"jobs_luxembourg_{timestamp}.csv"
            df_jobs.to_csv(filename, index=False)
            print(f"[✔] Saved {final_count} jobs to {filename}")
            
        # Upload to Supabase
        if args.upload:
            upload_to_supabase(df_jobs)
            
    else:
        print("[!] No jobs found.")

if __name__ == "__main__":
    main()
