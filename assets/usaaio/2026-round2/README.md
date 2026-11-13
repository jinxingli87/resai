# USAAIO 2026 Round 2 winners: counts per school

- Source: USAAIO's published Round 2 awardee sheet (https://docs.google.com/spreadsheets/d/e/2PACX-1vSVUjDn3ETDt8tOfddSubBorouV3UxASv5X9c7AYKF-sQKv5YGpPlAy0Hn-PQq74wYqzgwbpmCO-QK4/pubhtml)
- Built: 2026-11-13 by `scripts/usaaio/build_counts.py`
- `counts.json`: school -> number of winners per tier (Camper, Gold, Silver, Bronze)
- `schools.json`: school -> city, region, country, approximate coordinates (entered by hand, roughly 1-2 km), note

Privacy: these files contain **no student names**. The raw sheet stays in the git-ignored `data-raw/` folder
and is used only to compute the counts.
