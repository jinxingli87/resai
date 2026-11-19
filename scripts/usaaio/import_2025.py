"""Import the 2025 USA-NA-AIO problems and official solutions into the site.

Source: the standalone 2025 problem site built earlier (data-round-1.js / data-round-2.js),
whose content was collected from the official USAAIO forum threads.

Usage:
    python3 scripts/usaaio/import_2025.py [path/to/website]

Writes src/content/usaaio/2025-round1.json and 2025-round2.json.
"""

import json
import re
import sys
from pathlib import Path

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else Path.home() / "Documents/Doc2026/usaaio/website")
OUT = Path(__file__).resolve().parents[2] / "src/content/usaaio"


def load(path: Path) -> dict:
    s = path.read_text()
    return json.loads(s[s.index("{") : s.rstrip().rstrip(";").rindex("}") + 1])


def tidy(md: str) -> str:
    """Normalize the forum Markdown so remark-math + KaTeX render it like MathJax did."""
    if not md:
        return md

    def display(m: re.Match) -> str:
        indent, body = m.group(1) or "", m.group(2)
        # Forum posts double-space lines inside formulas; KaTeX does not need the blank lines.
        lines = [ln.strip() for ln in body.split("\n") if ln.strip()]
        # `$x$` nested inside \text{...} of a display formula -> \(x\) (KaTeX accepts both, remark-math does not).
        lines = [re.sub(r"(?<!\\)\$([^$\n]+?)\$", r"\\(\1\\)", ln) for ln in lines]
        # Keep the list-item indentation of the opening fence on every line.
        inner = "\n".join(indent + ln for ln in lines)
        return f"\n{indent}$$\n{inner}\n{indent}$$\n"

    # Display math: put fences on their own lines, keeping list indentation.
    parts = re.split(r"(```[\s\S]*?```)", md)  # leave code fences alone
    for i in range(0, len(parts), 2):
        parts[i] = re.sub(r"(?m)(^[ \t]*)?\$\$([\s\S]+?)\$\$", display, parts[i])
    md = "".join(parts)
    return re.sub(r"\n{3,}", "\n\n", md).strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for r in (1, 2):
        d = load(SRC / f"data-round-{r}.js")
        problems = []
        for p in d["problems"]:
            problems.append(
                {
                    "number": p["n"],
                    "points": p["total"],
                    "intro": tidy(p.get("intro") or ""),
                    "parts": [
                        {
                            "label": str(x["k"]),
                            "points": x["points"],
                            "kind": x["kind"],
                            "body": tidy(x["body"]),
                            "answer": tidy(x["answer"]),
                            "source": x["url"],
                        }
                        for x in p["parts"]
                    ],
                }
            )
            assert sum(x["points"] for x in p["parts"]) == p["total"], (r, p["n"])
        out = OUT / f"2025-round{r}.json"
        out.write_text(json.dumps({"problems": problems}, ensure_ascii=False, indent=1) + "\n")
        print(out, sum(len(p["parts"]) for p in problems), "parts")


if __name__ == "__main__":
    main()
