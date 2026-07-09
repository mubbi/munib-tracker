#!/usr/bin/env python3
"""Generate Munib Tracker brand assets from the official munib-logo.png."""

from __future__ import annotations

import math
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageOps
except ImportError:
    print("Install Pillow: pip install pillow", file=sys.stderr)
    sys.exit(1)

REPO_ROOT = Path(__file__).resolve().parents[3]
SOURCE = REPO_ROOT / "munib-logo.png"
APP_IMAGES = Path(__file__).resolve().parent.parent / "assets" / "images"
APP_PUBLIC_IMAGES = Path(__file__).resolve().parent.parent / "public" / "assets" / "images"
APP_PUBLIC = Path(__file__).resolve().parent.parent / "public"
MARKETING_PUBLIC = REPO_ROOT / "apps" / "marketing-web" / "public"

BRAND_BG = (21, 41, 33)  # #152921 — matches in-app hero gradient


def _ensure_source() -> Image.Image:
    if not SOURCE.exists():
        print(f"Missing official logo: {SOURCE}", file=sys.stderr)
        sys.exit(1)
    return Image.open(SOURCE).convert("RGBA")


def _flatten_on_bg(img: Image.Image, size: int, bg: tuple[int, int, int] = BRAND_BG) -> Image.Image:
    """Composite logo onto brand background at exact square size."""
    canvas = Image.new("RGBA", (size, size), (*bg, 255))
    fitted = ImageOps.contain(img, (size, size), method=Image.Resampling.LANCZOS)
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    canvas.paste(fitted, (x, y), fitted)
    return canvas


def _save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if img.mode == "RGBA":
        img.save(path, "PNG", optimize=True)
    else:
        img.convert("RGB").save(path, "PNG", optimize=True)
    print(f"  wrote {path.relative_to(REPO_ROOT)}")


def _generate_logo_glow(size: int = 512) -> Image.Image:
    """Soft gold radial glow for animated logo backgrounds."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    for radius in range(size // 2, 0, -2):
        t = radius / (size // 2)
        alpha = int(90 * (1 - t) ** 2)
        draw.ellipse(
            (cx - radius, cy - radius, cx + radius, cy + radius),
            fill=(228, 206, 158, alpha),
        )
    return img.filter(ImageFilter.GaussianBlur(radius=8))


def _generate_android_adaptive(logo: Image.Image) -> tuple[Image.Image, Image.Image, Image.Image]:
    """Android adaptive icon layers (108dp safe zone in 432/512 canvas)."""
    size = 432
    bg = Image.new("RGBA", (size, size), (*BRAND_BG, 255))

    # Foreground: logo scaled to ~72% safe zone
    fg_size = int(size * 0.72)
    fg = ImageOps.contain(logo, (fg_size, fg_size), method=Image.Resampling.LANCZOS)
    fg_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fg_canvas.paste(fg, ((size - fg.width) // 2, (size - fg.height) // 2), fg)

    # Monochrome: luminance silhouette for themed icons
    flat = _flatten_on_bg(logo, size)
    gray = ImageOps.grayscale(flat.convert("RGB"))
    mono = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    for y in range(size):
        for x in range(size):
            lum = gray.getpixel((x, y))
            if lum > 30:
                mono.putpixel((x, y), (255, 255, 255, min(255, lum + 40)))

    return fg_canvas, bg, mono


def _generate_favicon(logo: Image.Image) -> Image.Image:
    return _flatten_on_bg(logo, 48).convert("RGB")


def main() -> None:
    print(f"Source: {SOURCE.relative_to(REPO_ROOT)}")
    logo = _ensure_source()

    # Canonical in-app logo (keep original with transparency for UI overlays)
    _save_png(logo, APP_IMAGES / "munib-logo.png")

    # App / store icon (1024×1024)
    icon_1024 = _flatten_on_bg(logo, 1024)
    _save_png(icon_1024, APP_IMAGES / "icon.png")

    # PWA / favicon sizes
    for name, size in [
        ("icon-180.png", 180),
        ("icon-192.png", 192),
        ("icon-512.png", 512),
        ("favicon.png", 48),
        ("splash-icon.png", 280),
    ]:
        _save_png(_flatten_on_bg(logo, size), APP_IMAGES / name)

    # Decorative glow
    _save_png(_generate_logo_glow(), APP_IMAGES / "logo-glow.png")

    # Android adaptive layers
    fg, bg, mono = _generate_android_adaptive(logo)
    _save_png(fg, APP_IMAGES / "android-icon-foreground.png")
    _save_png(bg, APP_IMAGES / "android-icon-background.png")
    _save_png(mono, APP_IMAGES / "android-icon-monochrome.png")

    # Sync to app public/ for PWA
    for name in ["icon-180.png", "icon-192.png", "icon-512.png"]:
        shutil.copy2(APP_IMAGES / name, APP_PUBLIC_IMAGES / name)
        print(f"  synced public/{name}")

    shutil.copy2(APP_IMAGES / "icon-180.png", APP_PUBLIC / "apple-touch-icon.png")
    print("  synced public/apple-touch-icon.png")

    # Marketing site assets
    MARKETING_PUBLIC.mkdir(parents=True, exist_ok=True)
    for name, size in [
        ("icon-192.png", 192),
        ("icon-512.png", 512),
        ("apple-touch-icon.png", 180),
        ("favicon.png", 48),
    ]:
        _save_png(_flatten_on_bg(logo, size), MARKETING_PUBLIC / name)

    _save_png(logo, MARKETING_PUBLIC / "munib-logo.png")

    # Screenshot studio (tools/screenshot-studio/public)
    studio_public = REPO_ROOT / "tools" / "screenshot-studio" / "public"
    studio_app = REPO_ROOT / "tools" / "screenshot-studio" / "src" / "app"
    studio_public.mkdir(parents=True, exist_ok=True)
    studio_app.mkdir(parents=True, exist_ok=True)
    shutil.copy2(APP_IMAGES / "icon.png", studio_public / "app-icon.png")
    shutil.copy2(APP_IMAGES / "munib-logo.png", studio_public / "munib-logo.png")
    shutil.copy2(APP_IMAGES / "favicon.png", studio_app / "icon.png")
    shutil.copy2(APP_IMAGES / "icon-180.png", studio_app / "apple-icon.png")
    print("  synced screenshot-studio brand assets")

    print("Done.")


if __name__ == "__main__":
    main()
