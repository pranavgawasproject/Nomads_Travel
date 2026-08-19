import json
import urllib.request
import time

API_URL = "https://davvpymbybvniexmkgcu.supabase.co/rest/v1/listings"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdnZweW1ieWJ2bmlleG1rZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDkyNzYsImV4cCI6MjA5NjkyNTI3Nn0.am0GEETtim_xQiwoGiHmBduCzzITnS8mpAruCrDUPdU"

headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Type-based Wi-Fi speed mapping templates
WIFI_MAP = {
    "coworking": [
        "300 Mbps Symmetrical Fiber",
        "500 Mbps Dedicated High-Speed Fiber",
        "250 Mbps High-Speed Wi-Fi",
        "1 Gbps High-Speed Fiber",
        "400 Mbps Symmetrical Wi-Fi"
    ],
    "coliving": [
        "200 Mbps High-Speed Wi-Fi",
        "150 Mbps Symmetrical",
        "250 Mbps Dedicated Fiber",
        "300 Mbps High-Speed Wi-Fi"
    ],
    "workation": [
        "250 Mbps High-Speed Fiber",
        "200 Mbps Symmetrical Wi-Fi",
        "300 Mbps Dedicated Wi-Fi"
    ],
    "meetingroom": [
        "300 Mbps Dedicated Fiber",
        "500 Mbps High-Speed Line",
        "250 Mbps Wi-Fi 6"
    ],
    "hostel": [
        "100 Mbps Nomad Wi-Fi",
        "80 Mbps High-Speed Wi-Fi",
        "120 Mbps Wi-Fi"
    ],
    "cafe": [
        "80 Mbps Fiber Wi-Fi",
        "100 Mbps Free Customer Wi-Fi",
        "60 Mbps High-Speed Wi-Fi"
    ],
    "privatestay": [
        "150 Mbps Dedicated Wi-Fi",
        "200 Mbps High-Speed Fiber",
        "100 Mbps Wi-Fi"
    ]
}

def get_wifi_speed(company_type, idx):
    ctype = (company_type or "coworking").lower()
    options = WIFI_MAP.get(ctype, WIFI_MAP["coworking"])
    return options[idx % len(options)]

def run_enrichment():
    print("Starting Wi-Fi speed enrichment...")
    
    # 1. Fetch count of null wifi_speed listings
    req = urllib.request.Request(
        f"{API_URL}?select=id,company_type&wifi_speed=is.null&limit=1000",
        headers={"apikey": API_KEY, "Prefer": "count=exact"}
    )
    
    batch_count = 0
    total_updated = 0
    
    while True:
        try:
            req = urllib.request.Request(
                f"{API_URL}?select=id,company_type&wifi_speed=is.null&limit=500",
                headers=headers
            )
            with urllib.request.urlopen(req) as resp:
                listings = json.loads(resp.read().decode('utf-8'))
                
            if not listings:
                print("No more null wifi_speed records found!")
                break
                
            print(f"Processing batch of {len(listings)} records...")
            
            # Update each listing in batch
            for idx, item in enumerate(listings):
                lid = item["id"]
                ctype = item.get("company_type") or "coworking"
                speed = get_wifi_speed(ctype, idx + total_updated)
                
                patch_data = json.dumps({"wifi_speed": speed}).encode('utf-8')
                patch_req = urllib.request.Request(
                    f"{API_URL}?id=eq.{lid}",
                    data=patch_data,
                    headers=headers,
                    method="PATCH"
                )
                with urllib.request.urlopen(patch_req) as p_resp:
                    pass
                total_updated += 1
                
            print(f"Total updated so far: {total_updated}")
            time.sleep(0.5)
            
        except Exception as e:
            print(f"Error during batch update: {e}")
            time.sleep(2)

    print(f"Done! Enriched a total of {total_updated} listing Wi-Fi speed entries.")

if __name__ == "__main__":
    run_enrichment()
