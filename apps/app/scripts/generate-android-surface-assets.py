#!/usr/bin/env python3
"""Generate Android quick-action icons and unique widget picker previews for Munib Tracker."""

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
PREVIEW_LARGE = (960, 960)

THEME = {
    "background": (245, 240, 230),
    "card": (255, 252, 247),
    "text": (21, 41, 33),
    "text_secondary": (74, 95, 86),
    "border": (201, 192, 174),
    "primary": (5, 150, 105),
    "warning": (217, 119, 6),
    "qibla": (13, 148, 136),
    "tasbeeh": (124, 58, 237),
    "qaza": (217, 119, 6),
    "quran": (37, 99, 235),
    "ramadan": (67, 56, 202),
    "friday": (5, 150, 105),
}

QUICK_BG = {
    "quick_mark": THEME["primary"],
    "quick_checklist": THEME["primary"],
    "quick_qibla": THEME["qibla"],
    "quick_tasbeeh": THEME["tasbeeh"],
    "quick_qaza": THEME["qaza"],
    "quick_quran": THEME["quran"],
    "quick_ramadan": THEME["ramadan"],
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
    elif name == "quick_mark":
        _circle_outline(d, cx, cy, 34, white, sw)
        d.line(
            [(cx - 16, cy + 2), (cx - 4, cy + 15), (cx + 18, cy - 15)],
            fill=white,
            width=sw,
            joint="curve",
        )
    elif name == "quick_ramadan":
        d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=white)
        d.ellipse([cx - 10, cy - 26, cx + 30, cy + 18], fill=(0, 0, 0, 0))
    else:
        _circle_outline(d, cx, cy, 30, white, sw)

    return img


def _card(draw: ImageDraw.ImageDraw, size: tuple[int, int]) -> None:
    card = [24, 24, size[0] - 24, size[1] - 24]
    draw.rounded_rectangle(card, radius=28, fill=THEME["card"], outline=THEME["border"], width=2)


def _progress_bar(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, pct: float, color) -> None:
    h = 14
    draw.rounded_rectangle([x, y, x + w, y + h], radius=7, fill=THEME["border"])
    fill_w = max(12, int(w * pct))
    draw.rounded_rectangle([x, y, x + fill_w, y + h], radius=7, fill=color)


def draw_widget_preview(name: str) -> Image.Image:
    square_names = {
        "prayerprogresswidget_preview",
        "salahstreakwidget_preview",
        "hijridatewidget_preview",
        "qiblabearingwidget_preview",
        "khatmprogresswidget_preview",
        "prayerschedulewidget_preview",
        "tasbeehglancewidget_preview",
    }
    size = PREVIEW_SQUARE if name in square_names else PREVIEW_WIDE
    img = Image.new("RGB", size, THEME["background"])
    d = ImageDraw.Draw(img)
    _card(d, size)
    title_font = _try_font(36, bold=True)
    hero_font = _try_font(52, bold=True)
    body_font = _try_font(26)
    small_font = _try_font(22)
    x, y = 48, 48

    specs = {
        "nextprayerwidget_preview": {
            "title": "Next Salah",
            "hero": "Asr",
            "sub": "15:42",
            "meta": "in 27m · Maghrib 18:01",
            "accent": THEME["primary"],
        },
        "prayerschedulewidget_preview": {
            "title": "Today's schedule",
            "lines": [
                ("● Fajr · Completed", "05:12"),
                ("● Dhuhr · Completed", "12:45"),
                ("● Asr · Next", "15:42"),
                ("○ Maghrib · Pending", "18:01"),
                ("○ Isha · Pending", "19:22"),
            ],
            "accent": THEME["primary"],
        },
        "prayerprogresswidget_preview": {
            "title": "Today's progress",
            "hero": "3/5",
            "meta": "60%",
            "bar": 0.6,
            "accent": THEME["primary"],
        },
        "salahstreakwidget_preview": {
            "title": "Salah streak",
            "hero": "12",
            "meta": "12 days",
            "accent": THEME["primary"],
        },
        "qazadebtwidget_preview": {
            "title": "Qaza",
            "hero": "15",
            "meta": "15 remaining · 1 / 3 today",
            "bar": 0.33,
            "accent": THEME["warning"],
        },
        "ramadanwidget_preview": {
            "title": "Suhoor & Iftar",
            "hero": "Suhoor 05:12",
            "sub": "Iftar 18:01",
            "meta": "Iftar in 2h",
            "accent": THEME["primary"],
        },
        "khatmprogresswidget_preview": {
            "title": "Khatm plan",
            "hero": "34%",
            "meta": "12 of 20 today · On track",
            "bar": 0.34,
            "accent": THEME["quran"],
        },
        "dailyhadithwidget_preview": {
            "title": "Daily hadith",
            "hero": "Nawawi 1",
            "meta": "Actions are but by intention…",
            "accent": THEME["primary"],
        },
        "hijridatewidget_preview": {
            "title": "Islamic date",
            "hero": "25 Muharram",
            "sub": "1448 AH",
            "meta": "July 20, 2026",
            "accent": THEME["primary"],
        },
        "qiblabearingwidget_preview": {
            "title": "Qibla",
            "hero": "292°",
            "meta": "Direction to the Kaaba",
            "accent": THEME["qibla"],
        },
        "tasbeehglancewidget_preview": {
            "title": "Tasbeeh",
            "hero": "20 / 100",
            "meta": "Durood Shareef",
            "bar": 0.2,
            "accent": THEME["tasbeeh"],
        },
        "jumuahwidget_preview": {
            "title": "Jumu'ah",
            "hero": "3/6 done",
            "meta": "Friday checklist",
            "bar": 0.5,
            "accent": THEME["friday"],
        },
    }
    spec = specs.get(name, {"title": "Munib Tracker", "hero": "Widget", "meta": "", "accent": THEME["primary"]})
    accent = spec["accent"]
    d.text((x, y), spec["title"], fill=accent, font=title_font)
    y += 56
    if "lines" in spec:
        for left, right in spec["lines"]:
            d.text((x, y), left, fill=THEME["text"], font=small_font)
            tw = d.textlength(right, font=small_font) if hasattr(d, "textlength") else 80
            d.text((size[0] - 48 - tw, y), right, fill=THEME["text_secondary"], font=small_font)
            y += 40
    else:
        d.text((x, y), spec.get("hero", ""), fill=accent, font=hero_font)
        y += 70
        if spec.get("sub"):
            d.text((x, y), spec["sub"], fill=THEME["text"], font=body_font)
            y += 40
        if "bar" in spec:
            _progress_bar(d, x, y, size[0] - 96, float(spec["bar"]), accent)
            y += 36
        if spec.get("meta"):
            d.text((x, y), spec["meta"], fill=THEME["text_secondary"], font=body_font)
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
        "salahstreakwidget_preview",
        "qazadebtwidget_preview",
        "ramadanwidget_preview",
        "khatmprogresswidget_preview",
        "dailyhadithwidget_preview",
        "hijridatewidget_preview",
        "qiblabearingwidget_preview",
        "tasbeehglancewidget_preview",
        "jumuahwidget_preview",
    ):
        draw_widget_preview(name).save(PREVIEW_DIR / f"{name}.png")

    print(f"Wrote quick-action icons to {QUICK_DIR}")
    print(f"Wrote widget previews to {PREVIEW_DIR}")


if __name__ == "__main__":
    main()
