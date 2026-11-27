#!/usr/bin/env python3
"""Generate the PWA-only images referenced by public/manifest.json.

Writes to apps/app/assets/images/pwa/ (copied to public/ by sync-pwa-manifest.mjs):

- icon-{192,512}-maskable.png  maskable icons: the gold-rimmed logo (munib-logo-gold.png,
                          from generate-brand-assets.py) inside the 80% safe zone on the
                          brand background, so Android's circle / squircle masks never
                          crop it (the "any" icon-512.png is full-bleed).
- shortcut-*.png          96px app-shortcut icons from the native quick-action glyphs.
- screenshot-*.jpg        "narrow" install-dialog screenshots from the English Play phone
                          store set (store-assets/android/screenshots/phone/en, 9:16).
- screenshot-wide-*.jpg   "wide" (desktop) install-dialog screenshots from the English
                          10-inch tablet landscape store set — Chrome / Edge desktop only
                          show the richer install dialog with a "wide" screenshot.

Re-run after exporting new store decks (docs/STORE_ASSETS.md) or a new logo.

Run from anywhere: python apps/app/scripts/generate-pwa-assets.py
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Install Pillow: pip install pillow", file=sys.stderr)
    sys.exit(1)

APP_ROOT = Path(__file__).resolve().parent.parent
IMAGES = APP_ROOT / "assets" / "images"
OUT = IMAGES / "pwa"
STORE_SCREENSHOTS = APP_ROOT / "store-assets" / "android" / "screenshots"

BRAND_BG = (21, 41, 33)  # #152921 — same as generate-brand-assets.py

# Logo box as a share of the canvas. 0.58 keeps the squircle (incl. its rounded
# corners) inside the maskable 80% safe-zone circle.
MASKABLE_LOGO_SHARE = 0.58
SHORTCUT_SIZE = 96
SHORTCUT_GLYPH_SHARE = 0.6

# Manifest shortcut id → quick-action glyph (assets/images/quick-actions/).
SHORTCUTS = {
    "tracker": "quick_mark.png",
    "qibla": "quick_qibla.png",
    "tasbeeh": "quick_tasbeeh.png",
}

NARROW_CAPTURES = STORE_SCREENSHOTS / "phone" / "en"
# Manifest screenshot id → phone store image (1080×1920, 9:16).
SCREENSHOTS = {
    "home": "01-home.png",
    "salah": "02-salah.png",
    "qaza": "03-qaza.png",
    "library": "04-library.png",
    "qibla": "05-qibla.png",
}
# Same 9:16 ratio for every narrow shot (Chrome requires one ratio per form factor).
SCREENSHOT_SIZE = (720, 1280)

WIDE_CAPTURES = STORE_SCREENSHOTS / "tablet-10-inch" / "landscape" / "en"
# Manifest wide screenshot id → tablet landscape store image (2560×1600, 16:10).
WIDE_SCREENSHOTS = {
    "home": "01-home.png",
    "salah": "02-salah.png",
    "library": "04-library.png",
}
# Same 16:10 ratio for every wide shot (Chrome requires one ratio per form factor).
WIDE_SCREENSHOT_SIZE = (1280, 800)


def _on_brand_bg(img: Image.Image, size: int, share: float, *, min_alpha: int = 1) -> Image.Image:
    rgba = img.convert("RGBA")
    solid = rgba.split()[3].point(lambda a: 255 if a >= min_alpha else 0)
    bbox = solid.getbbox() or (0, 0, rgba.width, rgba.height)
    cropped = rgba.crop(bbox)
    box = round(size * share)
    fitted = ImageOps.contain(cropped, (box, box), method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), BRAND_BG)
    canvas.paste(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2), fitted)
    return canvas


def _save(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix == ".jpg":
        img.save(path, quality=85, optimize=True, progressive=True)
    else:
        img.save(path, optimize=True)
    print(f"  wrote {path.relative_to(APP_ROOT)}")


def main() -> None:
    logo = Image.open(IMAGES / "munib-logo-gold.png")
    for size in (192, 512):
        # min_alpha: size the box to the rim, not the gold logo's faint outer glow.
        _save(_on_brand_bg(logo, size, MASKABLE_LOGO_SHARE, min_alpha=48), OUT / f"icon-{size}-maskable.png")

    for name, glyph in SHORTCUTS.items():
        source = Image.open(IMAGES / "quick-actions" / glyph)
        _save(
            _on_brand_bg(source, SHORTCUT_SIZE, SHORTCUT_GLYPH_SHARE),
            OUT / f"shortcut-{name}.png",
        )

    for name, capture in SCREENSHOTS.items():
        source = NARROW_CAPTURES / capture
        if not source.exists():
            print(f"  missing {source.relative_to(APP_ROOT)} — export the store screenshots first")
            continue
        shot = ImageOps.fit(
            Image.open(source).convert("RGB"), SCREENSHOT_SIZE, Image.Resampling.LANCZOS
        )
        _save(shot, OUT / f"screenshot-{name}.jpg")

    for name, capture in WIDE_SCREENSHOTS.items():
        source = WIDE_CAPTURES / capture
        if not source.exists():
            print(f"  missing {source.relative_to(APP_ROOT)} — export the store screenshots first")
            continue
        shot = ImageOps.fit(
            Image.open(source).convert("RGB"), WIDE_SCREENSHOT_SIZE, Image.Resampling.LANCZOS
        )
        _save(shot, OUT / f"screenshot-wide-{name}.jpg")


if __name__ == "__main__":
    main()
