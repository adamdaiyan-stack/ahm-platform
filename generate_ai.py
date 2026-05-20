"""
AHM Platform — Sprint 6 First AI Generation Run
Run: python generate_ai.py
"""
import urllib.request, urllib.error, json, time

ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdW5ocWd4c2p5dmNyY25mYWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODE4MzUsImV4cCI6MjA5NDA1NzgzNX0.C6sh3g5sD5bsr34aArj2Alf_0b17jNY2OVlQBQW2o3c"
BASE = "https://qiunhqgxsjyvcrcnfajl.supabase.co/functions/v1"

HEADERS = {
    "Authorization": f"Bearer {ANON}",
    "Content-Type": "application/json",
    "apikey": ANON,
}

def post(path, body):
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE}/{path}",
        data=data,
        headers=HEADERS,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return json.loads(r.read().decode("utf-8")), None
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')}"
    except Exception as e:
        return None, str(e)

def status(result, error, keys=("qualityStatus",)):
    if error:
        return f"ERROR — {error}"
    for k in keys:
        if isinstance(result, dict):
            # nested: narrative.qualityStatus
            for part in k.split("."):
                result = result.get(part, result) if isinstance(result, dict) else result
            if isinstance(result, str):
                return result
    return json.dumps(result)[:120]

print("=" * 60)
print("STEP 1 — Company narratives")
print("=" * 60)
for sym in ["LUCK", "HBL", "UBL", "MCB", "BAFL", "OGDC", "PPL"]:
    print(f"  {sym}...", end=" ", flush=True)
    r, err = post("fn-generate-company-narrative", {"symbol": sym})
    if err:
        print(f"ERROR — {err}")
    else:
        nar = (r or {}).get("narrative", {})
        conv = (r or {}).get("conviction", {})
        print(f"narrative={nar.get('qualityStatus','?')}  conviction={conv.get('qualityStatus','?')}  cache={nar.get('fromCache','?')}")
    time.sleep(2)

print()
print("=" * 60)
print("STEP 2 — Sector briefs")
print("=" * 60)
for sector in ["banking", "oil-gas", "fertiliser", "cement", "power-ipp", "textiles", "auto"]:
    print(f"  {sector}...", end=" ", flush=True)
    r, err = post("fn-generate-sector-brief", {"sector_slug": sector})
    if err:
        print(f"ERROR — {err}")
    else:
        print(f"qualityStatus={(r or {}).get('qualityStatus','?')}  cache={(r or {}).get('fromCache','?')}")
    time.sleep(2)

print()
print("=" * 60)
print("STEP 3 — Market summary")
print("=" * 60)
print("  eod_summary...", end=" ", flush=True)
r, err = post("fn-generate-market-summary", {"snapshot_type": "eod_summary"})
if err:
    print(f"ERROR — {err}")
else:
    print(f"status={(r or {}).get('status','?')}  qualityStatus={(r or {}).get('qualityStatus','?')}")

print()
print("Done. Check Supabase → ai_outputs table for results.")
