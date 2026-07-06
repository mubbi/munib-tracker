#!/usr/bin/env python3
"""Generate Android quick-action icons and widget picker previews for Munib Tracker."""

from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Install Pillow: pip install pillow", file=sys.stderr)
    sys.exit(1)

APP_ROOT = Path(__file__).resolve().parent.parent
QUICK_DIR = APP_ROOT / "assets" / "images" / "quick-actions"
PREVIEW_DIR = APP_ROOT / "assets" / "images" / "widget-previews"

QUICK_SIZE = 108
PREVIEW_WIDE = (960, 422)
PREVIEW_SQUARE = (960, 960)

THEME = {
    "background": (245, 240, 230),
    "card": (255, 252, 247),
    "text": (21, 41, 33),
    "text_secondary": (92, 114, 104),
    "border": (201, 192, 174),
    "primary": (5, 150, 105),
    "qibla": (13, 148, 136),
    "tasbeeh": (124, 58, 237),
    "qaza": (217, 119, 6),
    "quran": (37, 99, 235),
}

QUICK_BG = {
    "quick_checklist": THEME["primary"],
    "quick_qibla": THEME["qibla"],
    "quick_tasbeeh": THEME["tasbeeh"],
    "quick_qaza": THEME["qaza"],
    "quick_quran": THEME["quran"],
}


def _try_font(size: int, bold: bool = False):
    candidates = (
        ("segoeuib.ttf", "arialbd.ttf", "Arial Bold.ttf")
        if bold
        else ("segoeui.ttf", "arial.ttf", "Arial.ttf")
    )
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _circle_outline(draw, cx, cy, r, fill, width=5):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fill, width=width)


def draw_quick_icon(name: str) -> Image.Image:
    img = Image.new("RGBA", (QUICK_SIZE, QUICK_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    white = (255, 255, 255, 255)
    cx, cy = QUICK_SIZE // 2, QUICK_SIZE // 2
    sw = 5

    if name == "quick_checklist":
        _circle_outline(d, cx, cy, 34, white, sw)
        d.line([(cx, cy - 16), (cx, cy + 16)], fill=white, width=sw)
        d.line([(cx - 16, cy), (cx + 16, cy)], fill=white, width=sw)
    elif name == "quick_qibla":
        _circle_outline(d, cx, cy, 34, white, sw)
        d.polygon([(cx, cy - 22), (cx + 10, cy + 18), (cx - 10, cy + 18)], outline=white, width=sw)
    elif name == "quick_tasbeeh":
        d.ellipse([cx - 28, cy - 18, cx + 28, cy + 18], outline=white, width=sw)
        d.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=white)
    elif name == "quick_qaza":
        _circle_outline(d, cx, cy, 30, white, sw)
        d.arc([cx - 18, cy - 18, cx + 18, cy + 18], start=30, end=300, fill=white, width=sw)
        d.polygon([(cx + 14, cy - 4), (cx + 24, cy + 6), (cx + 14, cy + 16)], fill=white)
    elif name == "quick_quran":
        d.rounded_rectangle([cx - 24, cy - 28, cx + 24, cy + 28], radius=6, outline=white, width=sw)
        d.line([(cx - 8, cy - 20), (cx - 8, cy + 20)], fill=white, width=sw)
    else:
        _circle_outline(d, cx, cy, 30, white, sw)

    return img


def draw_widget_preview(name: str) -> Image.Image:
    size = PREVIEW_SQUARE if "progress" in name else PREVIEW_WIDE
    img = Image.new("RGB", size, THEME["background"])
    d = ImageDraw.Draw(img)
    card = [24, 24, size[0] - 24, size[1] - 24]
    d.rounded_rectangle(card, radius=28, fill=THEME["card"], outline=THEME["border"], width=2)
    title_font = _try_font(42, bold=True)
    body_font = _try_font(28)

    labels = {
        "nextprayerwidget_preview": ("Next prayer", "Asr · 15:42", "in 27m"),
        "prayerschedulewidget_preview": ("Today's schedule", "Fajr 05:12", "Dhuhr 12:45"),
        "prayerprogresswidget_preview": ("Today's progress", "3/5", "60%"),
    }
    title, line1, line2 = labels.get(name, ("Munib Tracker", "Widget preview", ""))

    d.text((48, 48), title, fill=THEME["primary"], font=title_font)
    d.text((48, 120), line1, fill=THEME["text"], font=body_font)
    if line2:
        d.text((48, 170), line2, fill=THEME["text_secondary"], font=body_font)
    return img


def main() -> None:
    QUICK_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

    for name in QUICK_BG:
        draw_quick_icon(name).save(QUICK_DIR / f"{name}.png")

    for name in (
        "nextprayerwidget_preview",
        "prayerschedulewidget_preview",
        "prayerprogresswidget_preview",
    ):
        draw_widget_preview(name).save(PREVIEW_DIR / f"{name}.png")

    print(f"Wrote quick-action icons to {QUICK_DIR}")
    print(f"Wrote widget previews to {PREVIEW_DIR}")


if __name__ == "__main__":
    main()
