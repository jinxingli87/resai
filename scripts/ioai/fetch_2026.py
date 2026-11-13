"""Fetch IOAI 2026 Individual Contest statements (CC BY 4.0) into the site's content folder.

English: Individual-Contest/<task>/statement.md (source of truth)
Chinese: Individual-Contest/<task>/Translations/China.md (team-leader reviewed, authoritative)

Usage (from resai/web):
    python3 scripts/ioai/fetch_2026.py
"""

import posixpath
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = "https://raw.githubusercontent.com/IOAI-official/IOAI-2026/main/Individual-Contest"
TASKS = {
    "find-the-order": "1_Find_the_Order",
    "robot-chasing": "2_Robot_Chasing",
    "potato": "3_Potato",
    "double-agent-dilemma": "4_Double_Agent_Dilemma",
    "ghost-of-the-machine": "5_Ghost_of_Machine",
    "ioai-field": "6_IOAI_Field",
}
IMG = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)\)|<img[^>]*src=\"([^\"]+)\"")


def get(url):
    with urllib.request.urlopen(url) as resp:
        return resp.read()


def fetch_md(folder, rel):
    return get(f"{RAW}/{folder}/{urllib.parse.quote(rel)}").decode("utf-8")


def localize_images(md, folder, slug, md_dir):
    public = ROOT / "public" / "ioai" / "2026" / slug
    public.mkdir(parents=True, exist_ok=True)

    def repl(m):
        src = m.group(2) or m.group(3)
        if src.startswith("http"):
            return m.group(0)
        rel = posixpath.normpath(posixpath.join(md_dir, urllib.parse.unquote(src)))
        name = Path(rel).name
        (public / name).write_bytes(get(f"{RAW}/{folder}/{urllib.parse.quote(rel)}"))
        url = f"/ioai/2026/{slug}/{name}"
        return m.group(0).replace(src, url)

    return IMG.sub(repl, md)


def main():
    out = ROOT / "src" / "content" / "ioai" / "2026"
    out.mkdir(parents=True, exist_ok=True)
    for slug, folder in TASKS.items():
        en = localize_images(fetch_md(folder, "statement.md"), folder, slug, ".")
        zh = localize_images(fetch_md(folder, "Translations/China.md"), folder, slug, "Translations")
        (out / f"{slug}.en.md").write_text(en, encoding="utf-8")
        (out / f"{slug}.zh.md").write_text(zh, encoding="utf-8")
        print(f"{slug}: en {len(en)} chars, zh {len(zh)} chars")


if __name__ == "__main__":
    main()
