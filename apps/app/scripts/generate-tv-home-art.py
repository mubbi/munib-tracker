#!/usr/bin/env python3
"""Generate artwork for the TV home surfaces (Android TV channel row + tvOS Top Shelf).

Cards are text-free on purpose: titles and descriptions are localized metadata the
app publishes at runtime (24 locales), so the art only carries a motif per kind.

Outputs (committed; re-run only when the art changes):
  modules/munib-tv-home/android/src/main/res/drawable-nodpi/tv_home_<kind>.png  640x360
  modules/munib-tv-home/android/src/main/res/drawable-nodpi/tv_home_channel_logo.png 160x160
  tv-targets/top-shelf/Art/tv_home_<kind>.png                                 1096x616 (@2x hdtv)

Usage: python scripts/generate-tv-home-art.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

APP_ROOT = Path(__file__).resolve().parent.parent
LOGO = APP_ROOT / "assets" / "images" / "munib-logo.png"
ANDROID_OUT = APP_ROOT / "modules" / "munib-tv-home" / "android" / "src" / "main" / "res" / "drawable-nodpi"
TVOS_OUT = APP_ROOT / "tv-targets" / "top-shelf" / "Art"

BRAND_BG = (21, 41, 33)  # #152921 — same as generate-brand-assets.py
GOLD = (228, 206, 158)  # #E4CE9E — Brand.heroAccent
SS = 3  # supersampling factor for smooth edges

# kind -> gradient end colour (start is always BRAND_BG)
KINDS: dict[str, tuple[int, int, int]] = {
    "salah": (30, 74, 92),
    "tracker": (34, 80, 58),
    "quran": (54, 72, 40),
    "hadith": (78, 62, 36),
    "adhkar": (40, 64, 86),
    "ramadan": (64, 44, 84),
    "friday": (28, 86, 76),
}


def _gradient(w: int, h: int, end: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGB", (w, h), BRAND_BG)
    px = img.load()
    for y in range(h):
        for x in range(w):
            # Diagonal blend, darker toward the bottom-left.
            t = min(1.0, max(0.0, (x / w) * 0.65 + (1 - y / h) * 0.35))
            px[x, y] = tuple(int(BRAND_BG[i] + (end[i] - BRAND_BG[i]) * t) for i in range(3))
    return img


def _gold(alpha: int = 255) -> tuple[int, int, int, int]:
    return (*GOLD, alpha)


def _motif(kind: str, d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, bg) -> None:
    g = _gold()
    lw = max(2, int(r * 0.09))
    if kind == "salah":
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=g)
        off = r * 0.42
        d.ellipse([cx - r + off, cy - r - off * 0.2, cx + r + off, cy + r - off * 0.2], fill=bg)
        _star(d, cx + r * 0.62, cy - r * 0.45, r * 0.22, 5, g)
    elif kind == "tracker":
        for i in range(3):
            y = cy - r * 0.7 + i * r * 0.7
            d.ellipse([cx - r, y - r * 0.2, cx - r * 0.6, y + r * 0.2], outline=g, width=lw)
            if i < 2:
                d.line([(cx - r * 0.92, y), (cx - r * 0.82, y + r * 0.1), (cx - r * 0.66, y - r * 0.12)], fill=g, width=lw)
            d.rounded_rectangle([cx - r * 0.4, y - r * 0.06, cx + r, y + r * 0.06], radius=r * 0.06, fill=g)
    elif kind == "quran":
        top, bot = cy - r * 0.55, cy + r * 0.45
        d.polygon([(cx, top + r * 0.12), (cx - r, top), (cx - r, bot), (cx, bot + r * 0.12)], outline=g, width=lw)
        d.polygon([(cx, top + r * 0.12), (cx + r, top), (cx + r, bot), (cx, bot + r * 0.12)], outline=g, width=lw)
        for i in range(3):
            y = top + r * 0.3 + i * r * 0.22
            d.line([(cx - r * 0.8, y), (cx - r * 0.18, y + r * 0.05)], fill=g, width=max(1, lw // 2))
            d.line([(cx + r * 0.18, y + r * 0.05), (cx + r * 0.8, y)], fill=g, width=max(1, lw // 2))
        d.line([(cx - r * 0.7, cy + r * 0.85), (cx + r * 0.7, cy + r * 0.55)], fill=g, width=lw)
        d.line([(cx + r * 0.7, cy + r * 0.85), (cx - r * 0.7, cy + r * 0.55)], fill=g, width=lw)
    elif kind == "hadith":
        d.rounded_rectangle([cx - r * 0.8, cy - r, cx + r * 0.8, cy + r], radius=r * 0.18, outline=g, width=lw)
        for i in range(5):
            y = cy - r * 0.6 + i * r * 0.3
            right = cx + (r * 0.55 if i < 4 else r * 0.1)
            d.line([(cx - r * 0.55, y), (right, y)], fill=g, width=max(1, lw // 2))
    elif kind == "adhkar":
        beads = 18
        for i in range(beads):
            a = 2 * math.pi * i / beads - math.pi / 2
            bx, by = cx + math.cos(a) * r * 0.85, cy + math.sin(a) * r * 0.85
            br = r * (0.13 if i else 0.2)
            d.ellipse([bx - br, by - br, bx + br, by + br], fill=g)
        d.line([(cx, cy - r * 0.85), (cx, cy - r * 1.25)], fill=g, width=lw)
    elif kind == "ramadan":
        d.polygon([(cx - r * 0.45, cy - r * 0.5), (cx + r * 0.45, cy - r * 0.5), (cx + r * 0.62, cy + r * 0.55),
                   (cx - r * 0.62, cy + r * 0.55)], outline=g, width=lw)
        d.polygon([(cx - r * 0.3, cy - r * 0.5), (cx, cy - r * 0.85), (cx + r * 0.3, cy - r * 0.5)], fill=g)
        d.ellipse([cx - r * 0.1, cy - r * 1.05, cx + r * 0.1, cy - r * 0.85], outline=g, width=max(1, lw // 2))
        d.rectangle([cx - r * 0.7, cy + r * 0.55, cx + r * 0.7, cy + r * 0.7], fill=g)
        d.ellipse([cx - r * 0.16, cy - r * 0.1, cx + r * 0.16, cy + r * 0.22], fill=g)
    elif kind == "friday":
        _rub_el_hizb(d, cx, cy, r, g, lw)


def _star(d, cx, cy, r, points, fill) -> None:
    pts = []
    for i in range(points * 2):
        rr = r if i % 2 == 0 else r * 0.45
        a = math.pi * i / points - math.pi / 2
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    d.polygon(pts, fill=fill)


def _rub_el_hizb(d, cx, cy, r, fill, lw) -> None:
    for rot in (0, math.pi / 4):
        pts = [(cx + math.cos(rot + k * math.pi / 2) * r, cy + math.sin(rot + k * math.pi / 2) * r) for k in range(4)]
        d.polygon(pts, outline=fill, width=lw)
    ir = r * 0.32
    d.ellipse([cx - ir, cy - ir, cx + ir, cy + ir], outline=fill, width=lw)


def _logo(size: int) -> Image.Image:
    logo = Image.open(LOGO).convert("RGBA")
    logo.thumbnail((size, size), Image.Resampling.LANCZOS)
    return logo


def render_card(kind: str, w: int, h: int) -> Image.Image:
    W, H = w * SS, h * SS
    base = _gradient(w, h, KINDS[kind]).resize((W, H), Image.Resampling.BICUBIC).convert("RGBA")

    # Soft gold glow behind the motif.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy, r = W * 0.68, H * 0.52, H * 0.27
    gd.ellipse([cx - r * 1.7, cy - r * 1.7, cx + r * 1.7, cy + r * 1.7], fill=_gold(46))
    base = Image.alpha_composite(base, glow.filter(ImageFilter.GaussianBlur(H * 0.08)))

    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # ImageDraw replaces RGBA pixels, so a transparent fill cuts the crescent cleanly.
    _motif(kind, d, cx, cy, r, (0, 0, 0, 0))
    base = Image.alpha_composite(base, layer)

    logo = _logo(int(H * 0.2))
    base.alpha_composite(logo, (int(W * 0.06), int(H * 0.08)))
    return base.resize((w, h), Image.Resampling.LANCZOS).convert("RGB")


def render_channel_logo(size: int) -> Image.Image:
    # Opaque, shown under a circular mask (Android TV channel logo, 80dp).
    img = Image.new("RGBA", (size, size), (*BRAND_BG, 255))
    logo = _logo(int(size * 0.62))
    img.alpha_composite(logo, ((size - logo.width) // 2, (size - logo.height) // 2))
    return img.convert("RGB")


def main() -> None:
    ANDROID_OUT.mkdir(parents=True, exist_ok=True)
    TVOS_OUT.mkdir(parents=True, exist_ok=True)
    for kind in KINDS:
        render_card(kind, 640, 360).save(ANDROID_OUT / f"tv_home_{kind}.png", optimize=True)
        render_card(kind, 1096, 616).save(TVOS_OUT / f"tv_home_{kind}.png", optimize=True)
        print(f"  {kind}")
    render_channel_logo(160).save(ANDROID_OUT / "tv_home_channel_logo.png", optimize=True)
    print("done")


if __name__ == "__main__":
    main()
