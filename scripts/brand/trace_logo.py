"""Trace the ResAI raster logo into a two-color SVG.

Usage (from resai/web):
    uv run --with potracer --with pillow --with numpy --with scipy python scripts/brand/trace_logo.py
"""

from pathlib import Path

import numpy as np
import potrace
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "Res_Logo_transparent.png"
OUT = ROOT / "ResAI_logo.svg"

UPSCALE = 4          # trace at 4x so curves follow the soft edges more closely
HUE_SPLIT = 33       # degrees; "Res" orange is ~22, "AI" amber is ~43
PADDING = 8          # px of whitespace around the artwork in the final viewBox
SMOOTH = 3.0         # px (at original size); Gaussian blur before re-thresholding removes stair-step edges
OPT_TOLERANCE = 0.8  # higher merges more curve segments (smaller file, slightly looser fit)
DECIMALS = 1
COLORS = {"res": "#F06A1A", "ai": "#F9B20A"}


def load_masks():
    im = Image.open(SRC).convert("RGBA")
    im = im.resize((im.width * UPSCALE, im.height * UPSCALE), Image.LANCZOS)
    rgba = np.asarray(im).astype(np.float32) / 255.0
    alpha = rgba[..., 3]
    hue = np.asarray(im.convert("RGB").convert("HSV"))[..., 0].astype(np.float32) * 360 / 255

    ink = alpha > 0.5
    is_amber = hue >= HUE_SPLIT

    # Anti-aliased edge pixels can have off hues; assign every ink pixel to the color
    # that dominates its connected letter shape instead of trusting each pixel.
    labels, n = ndimage.label(ink)
    amber_share = ndimage.mean(is_amber, labels, index=np.arange(1, n + 1))
    sizes = ndimage.sum(ink, labels, index=np.arange(1, n + 1))
    min_size = 50 * UPSCALE * UPSCALE
    masks = {"res": np.zeros_like(ink), "ai": np.zeros_like(ink)}
    for i, (share, size) in enumerate(zip(amber_share, sizes), start=1):
        if size < min_size:
            continue
        masks["ai" if share > 0.5 else "res"] |= labels == i
    for key, mask in masks.items():
        masks[key] = ndimage.gaussian_filter(mask.astype(np.float32), sigma=SMOOTH * UPSCALE) > 0.5
    return masks, ink


def trace(mask):
    # potracer traces the pixels that fall below its black level, i.e. False/0 values.
    bitmap = potrace.Bitmap(~mask)
    return bitmap.trace(turdsize=20, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                        alphamax=1.25, opticurve=True, opttolerance=OPT_TOLERANCE)


def fmt(v):
    s = f"{v / UPSCALE:.{DECIMALS}f}".rstrip("0").rstrip(".")
    return "0" if s in ("", "-0") else s


def path_data(curves, dx, dy):
    def pt(p):
        return f"{fmt(p.x - dx)} {fmt(p.y - dy)}"

    parts = []
    for curve in curves:
        parts.append(f"M{pt(curve.start_point)}")
        for seg in curve.segments:
            if seg.is_corner:
                parts.append(f"L{pt(seg.c)}L{pt(seg.end_point)}")
            else:
                parts.append(f"C{pt(seg.c1)} {pt(seg.c2)} {pt(seg.end_point)}")
        parts.append("Z")
    return "".join(parts)


def main():
    masks, ink = load_masks()
    ys, xs = np.nonzero(ink)
    pad = PADDING * UPSCALE
    dx, dy = xs.min() - pad, ys.min() - pad
    width = (xs.max() - xs.min() + 2 * pad) / UPSCALE
    height = (ys.max() - ys.min() + 2 * pad) / UPSCALE

    paths = []
    for key in ("res", "ai"):
        d = path_data(trace(masks[key]), dx, dy)
        paths.append(f'  <path fill="{COLORS[key]}" fill-rule="evenodd" d="{d}"/>')

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:g} {height:g}" '
        f'width="{width:g}" height="{height:g}" role="img" aria-labelledby="resai-logo-title">\n'
        '  <title id="resai-logo-title">ResAI</title>\n'
        + "\n".join(paths)
        + "\n</svg>\n"
    )
    OUT.write_text(svg, encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}  ({len(svg) / 1024:.1f} KB, {width:g}x{height:g})")


if __name__ == "__main__":
    main()
