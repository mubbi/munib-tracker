#!/usr/bin/env python3
"""Generate Munib Tracker brand assets from the official munib-logo.png."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps
except ImportError:
    print("Install Pillow: pip install pillow", file=sys.stderr)
    sys.exit(1)

REPO_ROOT = Path(__file__).resolve().parents[3]
SOURCE = REPO_ROOT / "munib-logo.png"
APP_IMAGES = Path(__file__).resolve().parent.parent / "assets" / "images"
APP_PUBLIC_IMAGES = Path(__file__).resolve().parent.parent / "public" / "assets" / "images"
APP_PUBLIC = Path(__file__).resolve().parent.parent / "public"
MARKETING_PUBLIC = REPO_ROOT / "apps" / "marketing-web" / "public"
WATCH_APPICON = (
    Path(__file__).resolve().parent.parent
    / "targets"
    / "munib-tracker-watch"
    / "Assets.xcassets"
    / "AppIcon.appiconset"
    / "App-Icon-1024x1024@1x.png"
)
# Circular logo on a light canvas — App Review rejects full-bleed dark Watch icons
# (Guideline 4: black/near-black backgrounds don't read as circular on watchOS).
WATCH_ICON_SOURCE = APP_IMAGES / "icon-512-watch-apple.png"

BRAND_BG = (21, 41, 33)  # #152921 — matches in-app hero gradient
WATCH_ICON_BG = (255, 255, 255)
WATCH_ICON_FILL = 0.90  # leave a light rim inside the system circular mask
# Brand.heroAccent #E4CE9E — gilt rim so the squircle reads on BRAND_BG.
_SPLASH_RIM_GOLD = (228, 206, 158)
_SPLASH_RIM_STROKE_RATIO = 8 / 500
_SPLASH_RIM_GLOW_RATIO = 22 / 500
_SPLASH_RIM_GLOW_ALPHA = 180


def _ensure_source() -> Image.Image:
    if not SOURCE.exists():
        print(f"Missing official logo: {SOURCE}", file=sys.stderr)
        sys.exit(1)
    return Image.open(SOURCE).convert("RGBA")


def _opaque_bbox(img: Image.Image, *, min_alpha: int = 8, pad: int = 2) -> tuple[int, int, int, int]:
    """Bounding box of visible pixels, ignoring near-transparent export padding."""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    mask = img.split()[3].point(lambda a: 255 if a >= min_alpha else 0)
    bbox = mask.getbbox()
    if bbox is None:
        return (0, 0, img.width, img.height)
    left, top, right, bottom = bbox
    return (
        max(0, left - pad),
        max(0, top - pad),
        min(img.width, right + pad),
        min(img.height, bottom + pad),
    )


def _flatten_on_bg(img: Image.Image, size: int, bg: tuple[int, int, int] = BRAND_BG) -> Image.Image:
    """Composite logo onto brand background at exact square size (fully opaque RGB)."""
    canvas = Image.new("RGBA", (size, size), (*bg, 255))
    fitted = ImageOps.contain(img, (size, size), method=Image.Resampling.LANCZOS)
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    canvas.paste(fitted, (x, y), fitted)
    # Flatten alpha — store icons / adaptive backgrounds must be opaque.
    out = Image.new("RGB", (size, size), bg)
    out.paste(canvas, mask=canvas.split()[3])
    return out


def _rim_padding(img: Image.Image) -> int:
    """Pixels to expand so `_with_gold_rim` stroke + glow are not clipped."""
    size = max(img.size)
    stroke = max(4, round(size * _SPLASH_RIM_STROKE_RATIO))
    glow_r = max(8, round(size * _SPLASH_RIM_GLOW_RATIO))
    return stroke + glow_r + 2


def _with_gold_rim_padded(img: Image.Image) -> Image.Image:
    """Gold rim around a tightly-cropped silhouette (pad first, then stroke)."""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    pad = _rim_padding(img)
    canvas = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad), img)
    return _with_gold_rim(canvas)


def _flatten_full_bleed(
    img: Image.Image,
    size: int,
    bg: tuple[int, int, int] = BRAND_BG,
    *,
    gold_rim: bool = False,
) -> Image.Image:
    """Crop to the logo silhouette and fill the square — no extra canvas padding.

    The source mark is a squircle with transparent export padding. iOS / App Store
    apply their own mask, so compositing that squircle onto a larger background
    produces a tiny inset icon with a double-rounded frame. Fill the canvas and
    let the platform round the corners.
    """
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    cropped = img.crop(_opaque_bbox(img))
    if gold_rim:
        cropped = _with_gold_rim_padded(cropped)
        # Keep the gilt stroke; drop the faint outer glow so padding does not return.
        cropped = cropped.crop(_opaque_bbox(cropped, min_alpha=48, pad=1))
    side = max(cropped.size)
    square = Image.new("RGBA", (side, side), (*bg, 255))
    square.paste(
        cropped,
        ((side - cropped.width) // 2, (side - cropped.height) // 2),
        cropped,
    )
    fitted = square.resize((size, size), Image.Resampling.LANCZOS)
    out = Image.new("RGB", (size, size), bg)
    out.paste(fitted, mask=fitted.split()[3])
    return out


def _contain_transparent(img: Image.Image, size: int) -> Image.Image:
    """Resize logo onto a transparent square — keeps the iOS-style squircle alpha."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fitted = ImageOps.contain(img, (size, size), method=Image.Resampling.LANCZOS)
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    canvas.paste(fitted, (x, y), fitted)
    return canvas


def _odd(n: int) -> int:
    n = max(3, n)
    return n if n % 2 == 1 else n + 1


def _with_gold_rim(img: Image.Image) -> Image.Image:
    """Gold stroke + soft glow around the opaque silhouette.

    The logo fill matches the dark splash background (#152921), so without a
    rim the squircle disappears. Native splash cannot use CSS shadows.
    """
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    size = max(img.size)
    stroke = max(4, round(size * _SPLASH_RIM_STROKE_RATIO))
    glow_r = max(8, round(size * _SPLASH_RIM_GLOW_RATIO))
    alpha = img.split()[3]

    glow_mask = alpha.filter(ImageFilter.GaussianBlur(glow_r))
    glow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    glow_color = Image.new("RGBA", img.size, (*_SPLASH_RIM_GOLD, _SPLASH_RIM_GLOW_ALPHA))
    glow_layer.paste(glow_color, mask=glow_mask)

    dilated = alpha.filter(ImageFilter.MaxFilter(_odd(stroke * 2 + 1)))
    eroded = alpha.filter(ImageFilter.MinFilter(_odd(max(3, (stroke // 2) * 2 + 1))))
    ring = Image.new("RGBA", img.size, (*_SPLASH_RIM_GOLD, 255))
    ring.putalpha(ImageChops.subtract(dilated, eroded))

    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out = Image.alpha_composite(out, glow_layer)
    out = Image.alpha_composite(out, img)
    return Image.alpha_composite(out, ring)


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


def _write_ico(icon_48: Image.Image, ico_path: Path) -> None:
    ico_path.parent.mkdir(parents=True, exist_ok=True)
    # Pillow builds multi-size ICOs by resizing a single source via `sizes=` —
    # `append_images` is ignored by the ICO plugin and only yields 16×16.
    # Next.js / Turbopack ICO decoder requires embedded PNGs in RGBA (not RGB).
    rgba = icon_48.convert("RGBA")
    rgba.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  wrote {ico_path.relative_to(REPO_ROOT)}")


def _write_favicon_set(logo: Image.Image, dest_dir: Path, *, ico_path: Path | None = None) -> None:
    """Write favicon.png (48), 16/32 PNGs, optional multi-size .ico, and SVG shim."""
    dest_dir.mkdir(parents=True, exist_ok=True)
    icon_48 = _flatten_full_bleed(logo, 48)
    icon_32 = _flatten_full_bleed(logo, 32)
    icon_16 = _flatten_full_bleed(logo, 16)
    _save_png(icon_48, dest_dir / "favicon.png")
    _save_png(icon_32, dest_dir / "favicon-32.png")
    _save_png(icon_16, dest_dir / "favicon-16.png")

    # SVG that references the 32px PNG — same pattern as apps/admin.
    svg_path = dest_dir / "favicon.svg"
    svg_path.write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n'
        '  <image href="/favicon-32.png" width="32" height="32"/>\n'
        "</svg>\n",
        encoding="utf-8",
    )
    print(f"  wrote {svg_path.relative_to(REPO_ROOT)}")

    if ico_path is not None:
        _write_ico(icon_48, ico_path)


def _landscape_brand(
    logo: Image.Image,
    width: int,
    height: int,
    *,
    logo_scale: float = 0.55,
    wordmark: bool = False,
) -> Image.Image:
    """Centered logo on brand background for TV banners / Apple TV icons.

    Returns opaque RGB — Apple TV App Icon *Back* layers must be fully opaque
    (actool rejects any translucent pixel on the last content layer).
    """
    canvas = Image.new("RGBA", (width, height), (*BRAND_BG, 255))
    max_w = int(width * logo_scale)
    max_h = int(height * logo_scale)
    fitted = ImageOps.contain(logo, (max_w, max_h), method=Image.Resampling.LANCZOS)
    x = (width - fitted.width) // 2
    y = (height - fitted.height) // 2
    if wordmark:
        # Slightly higher so the mark reads as a hero on wide shelves.
        y = max(0, y - height // 16)
    canvas.paste(fitted, (x, y), fitted)
    out = Image.new("RGB", (width, height), BRAND_BG)
    out.paste(canvas, mask=canvas.split()[3])
    return out


def _non_near_white_bbox(
    img: Image.Image, *, thresh: int = 248, pad: int = 2
) -> tuple[int, int, int, int]:
    """Bounding box of pixels that are not near-white, with optional padding."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    pixels = rgb.load()
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r < thresh or g < thresh or b < thresh:
                found = True
                minx, miny = min(minx, x), min(miny, y)
                maxx, maxy = max(maxx, x), max(maxy, y)
    if not found:
        return 0, 0, w, h
    return (
        max(0, minx - pad),
        max(0, miny - pad),
        min(w, maxx + 1 + pad),
        min(h, maxy + 1 + pad),
    )


def _generate_watch_app_icon() -> None:
    """Build the watchOS 1024 AppIcon from the light-background Watch source art."""
    if not WATCH_ICON_SOURCE.exists():
        print(
            f"  skip watch AppIcon — missing {WATCH_ICON_SOURCE.relative_to(REPO_ROOT)}",
            file=sys.stderr,
        )
        return

    src = Image.open(WATCH_ICON_SOURCE).convert("RGBA")
    box = _non_near_white_bbox(src)
    cropped = src.crop(box)
    size = 1024
    target = int(size * WATCH_ICON_FILL)
    fitted = ImageOps.contain(cropped, (target, target), method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (*WATCH_ICON_BG, 255))
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    canvas.paste(fitted, (x, y), fitted)
    out = Image.new("RGB", (size, size), WATCH_ICON_BG)
    out.paste(canvas, mask=canvas.split()[3])
    _save_png(out, WATCH_APPICON)
    # Keep a square reference copy next to other brand icons (source stays hand-authored).
    _save_png(out, APP_IMAGES / "icon-watch-1024.png")


def _generate_tv_assets(logo: Image.Image) -> None:
    """Android Leanback + Apple TV + Amazon Fire TV console brand assets."""
    tv_dir = APP_IMAGES / "tv"
    tv_dir.mkdir(parents=True, exist_ok=True)

    # Android TV banner (exact 320×180) + launcher icon — baked into Leanback APK.
    _save_png(_landscape_brand(logo, 320, 180, logo_scale=0.72), tv_dir / "android-banner.png")
    _save_png(_flatten_on_bg(logo, 512), tv_dir / "android-icon.png")

    # Apple TV App Icon layers + Top Shelf images (exact sizes required by Xcode).
    apple = {
        "tvos-icon-1280x768.png": (1280, 768, 0.5),
        "tvos-icon-400x240.png": (400, 240, 0.55),
        "tvos-icon-800x480.png": (800, 480, 0.55),
        "tvos-topshelf-1920x720.png": (1920, 720, 0.42),
        "tvos-topshelf-3840x1440.png": (3840, 1440, 0.42),
        "tvos-topshelf-wide-2320x720.png": (2320, 720, 0.38),
        "tvos-topshelf-wide-4640x1440.png": (4640, 1440, 0.38),
    }
    for name, (w, h, scale) in apple.items():
        is_shelf = "topshelf" in name
        _save_png(
            _landscape_brand(logo, w, h, logo_scale=scale, wordmark=is_shelf),
            tv_dir / name,
        )

    # Amazon Fire TV Appstore Details — console upload only (not packaged in APK).
    # Background 1920×1080; icons 1280×720 / 512 / 114 (opaque RGB).
    _save_png(
        _landscape_brand(logo, 1920, 1080, logo_scale=0.36, wordmark=True),
        tv_dir / "firetv-background-1920x1080.png",
    )
    _save_png(
        _landscape_brand(logo, 1280, 720, logo_scale=0.5, wordmark=True),
        tv_dir / "firetv-icon-1280x720.png",
    )
    _save_png(_flatten_on_bg(logo, 512), tv_dir / "firetv-icon-512.png")
    _save_png(_flatten_on_bg(logo, 114), tv_dir / "firetv-icon-114.png")


def main() -> None:
    print(f"Source: {SOURCE.relative_to(REPO_ROOT)}")
    logo = _ensure_source()

    # Canonical in-app logo (keep original with transparency for UI overlays)
    _save_png(logo, APP_IMAGES / "munib-logo.png")

    # App / store icon (1024×1024). Full-bleed + gilt rim; iOS applies the squircle mask.
    icon_1024 = _flatten_full_bleed(logo, 1024, gold_rim=True)
    _save_png(icon_1024, APP_IMAGES / "icon.png")

    # PWA sizes. 180 / 512 are full-bleed (iOS home screen + "any" purpose).
    # 192 stays inset so Android maskable icons keep the 80% safe zone.
    _save_png(_flatten_full_bleed(logo, 180, gold_rim=True), APP_IMAGES / "icon-180.png")
    _save_png(_flatten_on_bg(logo, 192), APP_IMAGES / "icon-192.png")
    _save_png(_flatten_full_bleed(logo, 512, gold_rim=True), APP_IMAGES / "icon-512.png")

    # App favicon (48px PNG for expo web.favicon + multi-size .ico for /favicon.ico)
    icon_48 = _flatten_full_bleed(logo, 48)
    _save_png(icon_48, APP_IMAGES / "favicon.png")
    _write_ico(icon_48, APP_PUBLIC / "favicon.ico")
    shutil.copy2(APP_IMAGES / "favicon.png", APP_PUBLIC_IMAGES / "favicon.png")
    print("  synced public/assets/images/favicon.png")
    shutil.copy2(APP_PUBLIC / "favicon.ico", APP_IMAGES / "favicon.ico")
    print("  synced assets/images/favicon.ico")

    # Native splash: keep transparent corners so the baked-in squircle shows
    # (Android 12+ still applies a circular clip viewport — transparent outside
    # the squircle lets the brand background show through instead of a hard disc).
    # Gold rim + glow lift the icon off the matching #152921 fill.
    _save_png(_with_gold_rim(_contain_transparent(logo, 1024)), APP_IMAGES / "splash-icon.png")

    # Decorative glow
    _save_png(_generate_logo_glow(), APP_IMAGES / "logo-glow.png")

    # Android adaptive layers
    fg, bg, mono = _generate_android_adaptive(logo)
    _save_png(fg, APP_IMAGES / "android-icon-foreground.png")
    _save_png(bg, APP_IMAGES / "android-icon-background.png")
    _save_png(mono, APP_IMAGES / "android-icon-monochrome.png")

    # Apple TV / Android TV (Leanback banner, TV icon, top shelf)
    _generate_tv_assets(logo)

    # Apple Watch AppIcon (light canvas — required for App Review Guideline 4)
    _generate_watch_app_icon()

    # Sync to app public/ for PWA
    for name in ["icon-180.png", "icon-192.png", "icon-512.png"]:
        shutil.copy2(APP_IMAGES / name, APP_PUBLIC_IMAGES / name)
        print(f"  synced public/{name}")

    shutil.copy2(APP_IMAGES / "icon-180.png", APP_PUBLIC / "apple-touch-icon.png")
    print("  synced public/apple-touch-icon.png")

    # Marketing site assets
    MARKETING_PUBLIC.mkdir(parents=True, exist_ok=True)
    _save_png(_flatten_on_bg(logo, 192), MARKETING_PUBLIC / "icon-192.png")
    _save_png(_flatten_full_bleed(logo, 512, gold_rim=True), MARKETING_PUBLIC / "icon-512.png")
    _save_png(_flatten_full_bleed(logo, 180, gold_rim=True), MARKETING_PUBLIC / "apple-touch-icon.png")

    marketing_app = REPO_ROOT / "apps" / "marketing-web" / "src" / "app"
    _write_favicon_set(
        logo,
        MARKETING_PUBLIC,
        ico_path=marketing_app / "favicon.ico",
    )

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
