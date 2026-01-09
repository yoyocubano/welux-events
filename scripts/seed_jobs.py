
import os
import requests
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

# Helper to get any environment variable flavor
def get_env(keys):
    for key in keys:
        val = os.environ.get(key)
        if val:
            return val.strip() # Remove spaces/newlines!
    return None

SUPABASE_URL = get_env(["SUPABASE_URL", "VITE_SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_URL"])
SUPABASE_KEY = get_env(["SUPABASE_SERVICE_ROLE_KEY", "VITE_SUPABASE_ANON_KEY", "EXPO_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_KEY", "SUPABASE_ANON_KEY"])

def seed_jobs():
    print("[*] Connecting to Supabase (REST API)...")
    print(f"    Target URL: {SUPABASE_URL}")
    
    if not SUPABASE_KEY:
        print("[!] Error: No API Key found.")
        return
        
    print(f"    Key used (last 5 chars): ...{SUPABASE_KEY[-5:]}")

    # REST API Endpoint - Target 'jobs' table
    endpoint = f"{SUPABASE_URL}/rest/v1/jobs"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    
    # "SEO Bait" Jobs
    jobs = [
        {
            "title": "Delivery Driver (B License)",
            "company": "Amazon Logistics Lux",
            "location": "Luxembourg - South",
            "url": "https://weluxevents.com/jobs/apply?ref=driver_lux",
            "source": "Partner Network",
            "date_posted": datetime.now().isoformat(),
            "description": "Urgent hiring. Multiple positions for delivery drivers. Good salary + bonus. Valid driving license required."
        },
        {
            "title": "Administrative Assistant / Receptionist",
            "company": "European Institutions Support",
            "location": "Kirchberg",
            "url": "https://weluxevents.com/jobs/apply?ref=admin_eu",
            "source": "EURES",
            "date_posted": (datetime.now() - timedelta(hours=4)).isoformat(),
            "description": "English and French speaking administrative support. Entry level position open."
        },
        {
            "title": "Bank Clerk / KYC Officer",
            "company": "Financial Lux Group",
            "location": "Luxembourg City",
            "url": "https://weluxevents.com/jobs/apply?ref=finance_kyc",
            "source": "Jooble",
            "date_posted": (datetime.now() - timedelta(days=1)).isoformat(),
            "description": "Junior position in banking sector. Back office, compliance, and data entry. English mandatory."
        },
        {
            "title": "Construction Worker / Maçon",
            "company": "LuxBuild S.A.",
            "location": "Esch-sur-Alzette",
            "url": "https://weluxevents.com/jobs/apply?ref=construction",
            "source": "Adem Feed",
            "date_posted": (datetime.now() - timedelta(days=2)).isoformat(),
            "description": "Busca personal de construcción con experiencia. Contrato CDI inmediato."
        },
        {
            "title": "Cleaning Staff / Nettoyage",
            "company": "CleanServe Lux",
            "location": "Bertrange",
            "url": "https://weluxevents.com/jobs/apply?ref=cleaning",
            "source": "Direct",
            "date_posted": (datetime.now() - timedelta(days=3)).isoformat(),
            "description": "Part-time and Full-time cleaning positions for offices. Morning shifts available."
        }
    ]

    print(f"[*] Inserting {len(jobs)} seed jobs...")
    
    for job in jobs:
        try:
            response = requests.post(endpoint, headers=headers, json=job)
            
            if response.status_code in [200, 201, 204]:
                print(f"    [+] Added: {job['title']}")
            elif response.status_code == 409:
                 print(f"    [~] Already exists: {job['title']}")
            else:
                print(f"    [!] Error adding {job['title']}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"    [!] Exception adding {job['title']}: {e}")

    print("[✔] Seed complete!")

if __name__ == "__main__":
    seed_jobs()
