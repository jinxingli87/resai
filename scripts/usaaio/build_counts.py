"""Build name-free USAAIO statistics for the website.

Reads the raw awardee sheet (which contains student names) from the git-ignored data-raw/ folder
and writes only per-school counts. Names never leave data-raw/.

Usage (from resai/web):
    python3 scripts/usaaio/build_counts.py            # uses data-raw/usaaio-2026-round2.csv
    python3 scripts/usaaio/build_counts.py --refresh  # re-downloads the published sheet first
"""

import csv
import json
import sys
import urllib.request
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data-raw" / "usaaio-2026-round2.csv"
SCHOOLS_CSV = Path(__file__).with_name("schools.csv")
OUT = ROOT / "assets" / "usaaio" / "2026-round2"
SHEET_CSV_URL = (
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVUjDn3ETDt8tOfddSubBorouV3UxASv5X9c7AYKF-"
    "sQKv5YGpPlAy0Hn-PQq74wYqzgwbpmCO-QK4/pub?output=csv"
)
TIERS = ["Camper", "Gold", "Silver", "Bronze"]


def load_schools():
    schools, aliases = {}, {}
    with SCHOOLS_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = row["school"]
            schools[name] = {
                "city": row["city"] or None,
                "region": row["region"] or None,
                "country": row["country"] or None,
                "lat": float(row["lat"]) if row["lat"] else None,
                "lon": float(row["lon"]) if row["lon"] else None,
                "note": row["note"] or None,
            }
            for a in filter(None, row["aliases"].split("|")):
                aliases[a] = name
    return schools, aliases


def main():
    if "--refresh" in sys.argv or not RAW.exists():
        RAW.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(SHEET_CSV_URL) as resp:
            RAW.write_bytes(resp.read())

    schools, aliases = load_schools()
    counts = {}
    with RAW.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            raw = row["School"].strip()
            school = aliases.get(raw, raw)
            tier = row["Round 2 award"].strip()
            if tier not in TIERS:
                raise SystemExit(f"Unknown tier {tier!r} for school {raw!r}")
            if school not in schools:
                raise SystemExit(f"No location for school {school!r} (raw: {raw!r}); add it to schools.csv")
            counts.setdefault(school, Counter())[tier] += 1

    OUT.mkdir(parents=True, exist_ok=True)
    used = sorted(counts)
    (OUT / "schools.json").write_text(
        json.dumps({s: schools[s] for s in used}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (OUT / "counts.json").write_text(
        json.dumps({s: {t: counts[s][t] for t in TIERS} for s in used}, indent=1) + "\n", encoding="utf-8"
    )
    (OUT / "README.md").write_text(
        f"""# USAAIO 2026 Round 2 winners: counts per school

- Source: USAAIO's published Round 2 awardee sheet ({SHEET_CSV_URL.split('/pub')[0]}/pubhtml)
- Built: {date.today().isoformat()} by `scripts/usaaio/build_counts.py`
- `counts.json`: school -> number of winners per tier ({", ".join(TIERS)})
- `schools.json`: school -> city, region, country, approximate coordinates (entered by hand, roughly 1-2 km), note

Privacy: these files contain **no student names**. The raw sheet stays in the git-ignored `data-raw/` folder
and is used only to compute the counts.
""",
        encoding="utf-8",
    )
    total = sum(sum(c.values()) for c in counts.values())
    by_tier = Counter()
    for c in counts.values():
        by_tier.update(c)
    print(f"{total} winners, {len(used)} schools -> {OUT.relative_to(ROOT)}")
    print("  by tier:", {t: by_tier[t] for t in TIERS})


if __name__ == "__main__":
    main()
