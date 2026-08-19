import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

API_URL = "https://davvpymbybvniexmkgcu.supabase.co/rest/v1/listings"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdnZweW1ieWJ2bmlleG1rZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDkyNzYsImV4cCI6MjA5NjkyNTI3Nn0.am0GEETtim_xQiwoGiHmBduCzzITnS8mpAruCrDUPdU"

headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

BAD_DOMAINS = [
    "alamy.com",
    "shutterstock.com",
    "istockphoto.com",
    "lookaside.fbsbx.com",
    "lookaside.instagram.com",
    "i.pinimg.com",
    "depositphotos.com",
    "ggc.edu",
    "brightspotcdn.com"
]

CATEGORY_PHOTOS = {
    "coworking": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
    ],
    "coliving": [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
    ],
    "workation": [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ],
    "cafe": [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80"
    ],
    "hostel": [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    "meetingroom": [
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
    ]
}

def clean_images(imgs, ctype, idx):
    valid = []
    if imgs:
        for img in imgs:
            if not img or not isinstance(img, str):
                continue
            dom = urlparse(img).netloc.lower()
            if any(bad in dom or bad in img.lower() for bad in BAD_DOMAINS):
                continue
            valid.append(img)
            
    if not valid:
        cat = (ctype or "coworking").lower()
        pool = CATEGORY_PHOTOS.get(cat, CATEGORY_PHOTOS["coworking"])
        p1 = pool[idx % len(pool)]
        p2 = pool[(idx + 1) % len(pool)]
        valid = [p1, p2]
        
    return valid

def process_item(item, idx):
    lid = item["id"]
    imgs = item.get("images") or []
    ctype = item.get("company_type", "coworking")
    
    cleaned = clean_images(imgs, ctype, idx)
    
    # Only patch if images array changed
    if cleaned != imgs:
        patch_data = json.dumps({"images": cleaned}).encode('utf-8')
        patch_req = urllib.request.Request(
            f"{API_URL}?id=eq.{lid}",
            data=patch_data,
            headers=headers,
            method="PATCH"
        )
        try:
            with urllib.request.urlopen(patch_req) as resp:
                return True
        except Exception:
            return False
    return False

def run_image_cleanup():
    print("🧹 Starting Image Cleanup & High-Res Fallback Enrichment...")
    total_cleaned = 0
    offset = 0
    batch_size = 500
    
    while True:
        req = urllib.request.Request(
            f"{API_URL}?select=id,company_type,images&order=id.asc&offset={offset}&limit={batch_size}",
            headers=headers
        )
        try:
            with urllib.request.urlopen(req) as resp:
                listings = json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            print(f"Error fetching listings: {e}")
            break
            
        if not listings:
            print("✅ Finished processing all listings!")
            break
            
        print(f"Checking batch of {len(listings)} listings (Offset: {offset}, Cleaned so far: {total_cleaned})...")
        
        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = [executor.submit(process_item, item, offset + idx) for idx, item in enumerate(listings)]
            for future in as_completed(futures):
                if future.result():
                    total_cleaned += 1
                    
        offset += len(listings)

    print(f"🎉 Done! Cleaned/Enriched {total_cleaned} listings with high-resolution authentic photos.")

if __name__ == "__main__":
    run_image_cleanup()
