#!/usr/bin/env python3
"""Generate the seasonal (Islamic calendar) alternate app icons.

Every variant is the official Munib mark (`munib-logo.png`, same source as
`generate-brand-assets.py`) with a seasonal colour grade and vector motifs drawn
on top, so the icon stays recognisable on the home screen while it changes:

    ramadan   crescent + star in the arch, two hanging lanterns, indigo night
    lastTen   deep midnight, light pouring from the door, a sky full of stars
    eidFitr   festive emerald, a garland of lights, fireworks, crescent
    hajj      desert dusk, the Kaaba at the end of the path
    eidAdha   rich maroon, the Kaaba, gold pennant bunting, crescent
    newYear   dawn teal, a new crescent and a rising glow
    ashura    sober slate night, a thin crescent, calm water (Musa's crossing) — no festivity

Outputs (committed, bundled into the binaries by `modules/munib-app-icon/app.plugin.js`):

    assets/images/app-icons/<id>/icon.png                 1024 opaque RGB (iOS alternate icon)
    assets/images/app-icons/<id>/android-foreground.png   432 adaptive foreground (RGBA)
    assets/images/app-icons/<id>/android-background.png   432 adaptive background (RGB)
    assets/images/app-icons/<id>/android-monochrome.png   432 themed-icon layer (RGBA)
    assets/images/app-icons/<id>/android-legacy.png       192 pre-API-26 launcher bitmap
    assets/images/app-icons/<id>/preview.png              180 in-app picker thumbnail
    assets/images/app-icons/classic/preview.png           180 thumbnail of the primary icon

Run from anywhere:  python apps/app/scripts/generate-seasonal-icons.py
Needs Pillow + numpy (pip install pillow numpy). Pass --sheet <png> to also
write a contact sheet of every variant for review.
"""

from __future__ import annotations

import argparse
import importlib.util
import math
import sys
from pathlib import Path
from typing import Callable, Dict, List, Tuple

try:
    import numpy as np
    from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps
except ImportError:
    print("Install Pillow + numpy: pip install pillow numpy", file=sys.stderr)
    sys.exit(1)

SCRIPTS = Path(__file__).resolve().parent
APP_ROOT = SCRIPTS.parent
OUT_ROOT = APP_ROOT / "assets" / "images" / "app-icons"

# Reuse the brand pipeline (squircle crop, gilt rim, flattening) so the seasonal
# icons are built exactly like the primary one.
_spec = importlib.util.spec_from_file_location("brand_assets", SCRIPTS / "generate-brand-assets.py")
brand = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(brand)

RGB = Tuple[int, int, int]
RGBA = Tuple[int, int, int, int]

# Working resolution of the decorated mark, and the supersampling factor for motifs.
SIZE = 1024
SS = 4

GOLD: RGB = (228, 206, 158)  # Brand.heroAccent #E4CE9E — the mark's own gilt
BRIGHT_GOLD: RGB = (246, 214, 128)
CREAM: RGB = (250, 240, 214)
KAABA_BLACK: RGB = (18, 16, 14)

# Mark geometry in the 1024 working space (the squircle fills the canvas).
ARCH_CX = 512
ARCH_STAR = (512, 268)  # the small star above the door, inside the arch
DOOR = (512, 418)  # centre of the lit doorway
# The Kaaba stands in the doorway, just above and right of the figure's head (y≈428).
KAABA_AT = (526, 426)


# --------------------------------------------------------------------------- grade


def _rgb_to_hsv(rgb: "np.ndarray") -> "np.ndarray":
    """Vectorised RGB (0..1) → HSV (h in 0..360)."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(axis=-1)
    mn = rgb.min(axis=-1)
    d = mx - mn
    h = np.zeros_like(mx)
    nz = d > 1e-6
    rm = nz & (mx == r)
    gm = nz & (mx == g) & ~rm
    bm = nz & ~rm & ~gm
    h[rm] = (60 * ((g[rm] - b[rm]) / d[rm]) + 360) % 360
    h[gm] = 60 * ((b[gm] - r[gm]) / d[gm]) + 120
    h[bm] = 60 * ((r[bm] - g[bm]) / d[bm]) + 240
    s = np.where(mx > 1e-6, d / np.maximum(mx, 1e-6), 0)
    return np.stack([h, s, mx], axis=-1)


def _hsv_to_rgb(hsv: "np.ndarray") -> "np.ndarray":
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    c = v * s
    hp = (h % 360) / 60
    x = c * (1 - np.abs(hp % 2 - 1))
    z = np.zeros_like(h)
    conds = [hp < 1, hp < 2, hp < 3, hp < 4, hp < 5, hp >= 5]
    rs = [c, x, z, z, x, c]
    gs = [x, c, c, x, z, z]
    bs = [z, z, x, c, c, x]
    r = np.select(conds, rs)
    g = np.select(conds, gs)
    b = np.select(conds, bs)
    m = v - c
    return np.stack([r + m, g + m, b + m], axis=-1)


def grade(img: Image.Image, hue: float, sat: float = 1.0, val: float = 1.0) -> Image.Image:
    """Recolour the mark's greens to `hue`, leaving gold, cream and the lit door alone.

    Pixels are weighted by how "green" they are (hue 80–200°), so anti-aliased
    edges between the green field and the gilt arcs blend instead of fringing.
    """
    arr = np.asarray(img.convert("RGBA")).astype(np.float32) / 255.0
    rgb, alpha = arr[..., :3], arr[..., 3:]
    hsv = _rgb_to_hsv(rgb)
    h = hsv[..., 0]
    # 1 inside the green band, fading to 0 by the gold (≈50°) and blue (≈220°) edges.
    weight = np.clip(np.minimum((h - 70) / 25, (215 - h) / 25), 0, 1)
    # Near-neutral pixels (the cream path, highlights) keep their colour.
    weight *= np.clip((hsv[..., 1] - 0.08) / 0.12, 0, 1)
    graded = hsv.copy()
    graded[..., 0] = hue
    graded[..., 1] = np.clip(hsv[..., 1] * sat, 0, 1)
    graded[..., 2] = np.clip(hsv[..., 2] * val, 0, 1)
    out_rgb = rgb * (1 - weight[..., None]) + _hsv_to_rgb(graded) * weight[..., None]
    out = np.concatenate([out_rgb, alpha], axis=-1)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGBA")


# --------------------------------------------------------------------------- motifs


class Layer:
    """A supersampled RGBA layer in 1024 working coordinates."""

    def __init__(self) -> None:
        self.img = Image.new("RGBA", (SIZE * SS, SIZE * SS), (0, 0, 0, 0))
        self.draw = ImageDraw.Draw(self.img)

    @staticmethod
    def s(v: float) -> float:
        return v * SS

    def pts(self, points: List[Tuple[float, float]]) -> List[Tuple[float, float]]:
        return [(x * SS, y * SS) for x, y in points]

    def done(self) -> Image.Image:
        return self.img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def glow(center: Tuple[float, float], radius: float, color: RGB, alpha: int) -> Image.Image:
    """Soft radial light (blurred disc) at working resolution."""
    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.55))


def crescent(
    layer: Layer,
    center: Tuple[float, float],
    r: float,
    color: RGB,
    *,
    bite: float = 0.34,
    tilt_deg: float = -35,
) -> None:
    """Crescent = disc minus an offset disc, opening toward `tilt_deg` (0° = right)."""
    cx, cy = center
    mask = Image.new("L", layer.img.size, 0)
    md = ImageDraw.Draw(mask)
    md.ellipse([layer.s(v) for v in (cx - r, cy - r, cx + r, cy + r)], fill=255)
    a = math.radians(tilt_deg)
    ox, oy = cx + math.cos(a) * r * bite * 1.25, cy + math.sin(a) * r * bite * 1.25
    rr = r * 0.86
    md.ellipse([layer.s(v) for v in (ox - rr, oy - rr, ox + rr, oy + rr)], fill=0)
    solid = Image.new("RGBA", layer.img.size, (*color, 255))
    layer.img.paste(solid, mask=mask)


def star(
    layer: Layer,
    center: Tuple[float, float],
    r_out: float,
    color: RGB,
    *,
    points: int = 5,
    inner: float = 0.45,
    rotation: float = -90,
    alpha: int = 255,
) -> None:
    cx, cy = center
    verts = []
    for i in range(points * 2):
        rad = r_out if i % 2 == 0 else r_out * inner
        ang = math.radians(rotation + i * 180 / points)
        verts.append((cx + math.cos(ang) * rad, cy + math.sin(ang) * rad))
    layer.draw.polygon(layer.pts(verts), fill=(*color, alpha))


def sparkle(layer: Layer, center: Tuple[float, float], r: float, color: RGB, alpha: int = 255) -> None:
    """Four-point twinkle like the star already in the mark."""
    star(layer, center, r, color, points=4, inner=0.28, rotation=-90, alpha=alpha)


def lantern(layer: Layer, cx: float, top: float, height: float, frame: RGB, light: RGB) -> None:
    """A fanous: chain, domed cap, hexagonal glowing body, finial."""
    s = height / 260.0
    d = layer.draw
    chain_end = top + 60 * s
    d.line(layer.pts([(cx, top), (cx, chain_end)]), fill=(*frame, 255), width=int(layer.s(4 * s)))
    d.ellipse([layer.s(v) for v in (cx - 9 * s, chain_end - 4 * s, cx + 9 * s, chain_end + 14 * s)], outline=(*frame, 255), width=int(layer.s(4 * s)))
    cap_top = chain_end + 12 * s
    # Dome cap
    d.pieslice([layer.s(v) for v in (cx - 38 * s, cap_top, cx + 38 * s, cap_top + 60 * s)], 180, 360, fill=(*frame, 255))
    band_y = cap_top + 30 * s
    d.rectangle([layer.s(v) for v in (cx - 44 * s, band_y, cx + 44 * s, band_y + 10 * s)], fill=(*frame, 255))
    body_top = band_y + 10 * s
    body_h = 120 * s
    # Outer hexagonal body (frame), then the glowing panes inset.
    outer = [
        (cx - 36 * s, body_top),
        (cx + 36 * s, body_top),
        (cx + 52 * s, body_top + body_h * 0.42),
        (cx + 30 * s, body_top + body_h),
        (cx - 30 * s, body_top + body_h),
        (cx - 52 * s, body_top + body_h * 0.42),
    ]
    d.polygon(layer.pts(outer), fill=(*frame, 255))
    inset = 7 * s
    panes = [
        (cx - 36 * s + inset, body_top + inset),
        (cx + 36 * s - inset, body_top + inset),
        (cx + 52 * s - inset * 1.4, body_top + body_h * 0.42),
        (cx + 30 * s - inset, body_top + body_h - inset),
        (cx - 30 * s + inset, body_top + body_h - inset),
        (cx - 52 * s + inset * 1.4, body_top + body_h * 0.42),
    ]
    d.polygon(layer.pts(panes), fill=(*light, 255))
    # Pane mullions
    d.line(layer.pts([(cx, body_top + inset), (cx, body_top + body_h - inset)]), fill=(*frame, 255), width=int(layer.s(5 * s)))
    d.line(layer.pts([(cx - 46 * s, body_top + body_h * 0.42), (cx + 46 * s, body_top + body_h * 0.42)]), fill=(*frame, 255), width=int(layer.s(5 * s)))
    # Base + finial
    base_y = body_top + body_h
    d.rectangle([layer.s(v) for v in (cx - 34 * s, base_y, cx + 34 * s, base_y + 9 * s)], fill=(*frame, 255))
    d.polygon(layer.pts([(cx - 16 * s, base_y + 9 * s), (cx + 16 * s, base_y + 9 * s), (cx, base_y + 38 * s)]), fill=(*frame, 255))


def kaaba(layer: Layer, cx: float, base: float, width: float) -> None:
    """Three-quarter view of the Kaaba: front + side faces, gold hizam band and door."""
    d = layer.draw
    fw = width * 0.66  # front face width
    sw = width - fw  # visible side face
    h = width * 0.78
    lift = width * 0.10  # perspective rise of the side face
    left = cx - width / 2
    fx0, fx1 = left, left + fw
    top = base - h
    front = [(fx0, top), (fx1, top), (fx1, base), (fx0, base)]
    side = [(fx1, top), (fx1 + sw, top - lift), (fx1 + sw, base - lift), (fx1, base)]
    roof = [(fx0, top), (fx0 + sw, top - lift), (fx1 + sw, top - lift), (fx1, top)]
    d.polygon(layer.pts(roof), fill=(54, 48, 40, 255))
    d.polygon(layer.pts(front), fill=(*KAABA_BLACK, 255))
    d.polygon(layer.pts(side), fill=(34, 30, 26, 255))
    band_y = top + h * 0.22
    band_h = h * 0.11
    d.polygon(layer.pts([(fx0, band_y), (fx1, band_y), (fx1, band_y + band_h), (fx0, band_y + band_h)]), fill=(*BRIGHT_GOLD, 255))
    d.polygon(
        layer.pts([(fx1, band_y), (fx1 + sw, band_y - lift), (fx1 + sw, band_y - lift + band_h), (fx1, band_y + band_h)]),
        fill=(*GOLD, 255),
    )
    # Door (Bab al-Kaaba) — gold, raised off the ground, toward the right of the front face.
    dw = fw * 0.2
    dx = fx0 + fw * 0.62
    d.rectangle([layer.s(v) for v in (dx, base - h * 0.62, dx + dw, base - h * 0.14)], fill=(*BRIGHT_GOLD, 255))


def catenary(x0: float, x1: float, y: float, sag: float, n: int) -> List[Tuple[float, float]]:
    pts = []
    for i in range(n):
        t = i / (n - 1)
        pts.append((x0 + (x1 - x0) * t, y + sag * 4 * t * (1 - t)))
    return pts


def light_garland(layer: Layer, x0: float, x1: float, y: float, sag: float, colors: List[RGB]) -> Image.Image:
    """A string of glowing bulbs; returns the glow layer to composite underneath."""
    wire = catenary(x0, x1, y, sag, 60)
    layer.draw.line(layer.pts(wire), fill=(*GOLD, 210), width=int(layer.s(3)), joint="curve")
    bulbs = catenary(x0, x1, y, sag, 11)[1:-1]
    halo = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    for i, (bx, by) in enumerate(bulbs):
        c = colors[i % len(colors)]
        by += 12
        layer.draw.ellipse([layer.s(v) for v in (bx - 11, by - 11, bx + 11, by + 11)], fill=(*c, 255))
        halo = Image.alpha_composite(halo, glow((bx, by), 26, c, 150))
    return halo


def pennants(layer: Layer, x0: float, x1: float, y: float, sag: float, colors: List[RGB]) -> None:
    """Triangular bunting hanging from a sagging cord."""
    cord = catenary(x0, x1, y, sag, 60)
    layer.draw.line(layer.pts(cord), fill=(*GOLD, 230), width=int(layer.s(3)), joint="curve")
    flags = catenary(x0, x1, y, sag, 10)
    for i in range(len(flags) - 1):
        (ax, ay), (bx, by) = flags[i], flags[i + 1]
        mx, my = (ax + bx) / 2, (ay + by) / 2
        c = colors[i % len(colors)]
        layer.draw.polygon(layer.pts([(ax + 4, ay), (bx - 4, by), (mx, my + 56)]), fill=(*c, 255))


def firework(layer: Layer, center: Tuple[float, float], r: float, color: RGB, rays: int = 14) -> None:
    cx, cy = center
    for i in range(rays):
        a = math.radians(i * 360 / rays)
        x0, y0 = cx + math.cos(a) * r * 0.32, cy + math.sin(a) * r * 0.32
        x1, y1 = cx + math.cos(a) * r * 0.82, cy + math.sin(a) * r * 0.82
        layer.draw.line(layer.pts([(x0, y0), (x1, y1)]), fill=(*color, 235), width=int(layer.s(5)))
        dx, dy = cx + math.cos(a) * r, cy + math.sin(a) * r
        layer.draw.ellipse([layer.s(v) for v in (dx - 5, dy - 5, dx + 5, dy + 5)], fill=(*color, 255))


def rays(origin: Tuple[float, float], length: float, color: RGB, alpha: int, count: int = 9, spread: float = 120) -> Image.Image:
    """Soft beams of light fanning upward from `origin`."""
    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    ox, oy = origin
    for i in range(count):
        a = math.radians(-90 - spread / 2 + i * spread / (count - 1))
        half = math.radians(3.2)
        p1 = (ox + math.cos(a - half) * length, oy + math.sin(a - half) * length)
        p2 = (ox + math.cos(a + half) * length, oy + math.sin(a + half) * length)
        d.polygon([origin, p1, p2], fill=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(10))


def erase_star(img: Image.Image, fill_from: Tuple[int, int]) -> Image.Image:
    """Paint over the mark's small arch star with the surrounding field colour."""
    out = img.copy()
    field = out.getpixel(fill_from)
    patch = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(patch).ellipse((ARCH_STAR[0] - 22, ARCH_STAR[1] - 22, ARCH_STAR[0] + 22, ARCH_STAR[1] + 22), fill=field)
    return Image.alpha_composite(out, patch.filter(ImageFilter.GaussianBlur(4)))


# --------------------------------------------------------------------------- variants


def _base_mark() -> Image.Image:
    """The official squircle mark, cropped and scaled to fill the 1024 working canvas."""
    logo = Image.open(brand.SOURCE).convert("RGBA")
    cropped = logo.crop(brand._opaque_bbox(logo))
    side = max(cropped.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2), cropped)
    return square.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def _stars(layer: Layer, spots: List[Tuple[float, float, float]], color: RGB = CREAM) -> None:
    for x, y, r in spots:
        if r >= 9:
            sparkle(layer, (x, y), r, color)
        else:
            layer.draw.ellipse([layer.s(v) for v in (x - r, y - r, x + r, y + r)], fill=(*color, 235))


def ramadan(mark: Image.Image) -> Image.Image:
    img = grade(mark, hue=258, sat=1.25, val=1.0)
    img = erase_star(img, (512, 236))
    lights = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    for c in ((226, 168), (798, 168)):
        lights = Image.alpha_composite(lights, glow((c[0], c[1] + 145), 70, BRIGHT_GOLD, 120))
    img = Image.alpha_composite(img, lights)
    art = Layer()
    lantern(art, 226, 52, 250, GOLD, (255, 222, 140))
    lantern(art, 798, 52, 250, GOLD, (255, 222, 140))
    crescent(art, (502, 262), 30, BRIGHT_GOLD, tilt_deg=-20)
    star(art, (528, 250), 9, BRIGHT_GOLD)
    _stars(art, [(360, 120, 4), (660, 108, 10), (420, 70, 3), (600, 60, 4)])
    return Image.alpha_composite(img, art.done())


def last_ten(mark: Image.Image) -> Image.Image:
    img = grade(mark, hue=248, sat=1.2, val=0.82)
    img = Image.alpha_composite(img, rays(DOOR, 300, (255, 236, 180), 70, count=11, spread=150))
    img = Image.alpha_composite(img, glow(DOOR, 70, (255, 240, 200), 150))
    art = Layer()
    _stars(
        art,
        [
            (150, 130, 12), (300, 82, 4), (395, 150, 3), (455, 64, 9), (585, 96, 3),
            (640, 150, 4), (720, 70, 11), (878, 140, 4), (180, 260, 3), (850, 250, 5),
            (110, 380, 4), (920, 390, 3), (250, 190, 3), (790, 190, 3), (540, 40, 3),
        ],
    )
    crescent(art, (842, 120), 44, BRIGHT_GOLD, tilt_deg=-30)
    return Image.alpha_composite(img, art.done())


def eid_fitr(mark: Image.Image) -> Image.Image:
    img = grade(mark, hue=146, sat=1.6, val=1.25)
    bulbs = [(255, 214, 102), (255, 160, 122), (167, 243, 208), (196, 181, 253)]
    art = Layer()
    halo = light_garland(art, 40, 984, 40, 150, bulbs)
    img = Image.alpha_composite(img, halo)
    firework(art, (190, 290), 70, (255, 214, 102))
    firework(art, (840, 300), 58, (255, 170, 140), rays=12)
    _stars(art, [(300, 330, 4), (730, 360, 4), (150, 420, 3), (880, 430, 3)])
    img = erase_star(img, (512, 236))
    crescent(art, (502, 262), 30, BRIGHT_GOLD, tilt_deg=-20)
    star(art, (528, 250), 9, BRIGHT_GOLD)
    return Image.alpha_composite(img, art.done())


def hajj(mark: Image.Image) -> Image.Image:
    img = grade(mark, hue=30, sat=0.95, val=0.92)
    img = Image.alpha_composite(img, glow((DOOR[0], DOOR[1] + 10), 120, (255, 214, 150), 150))
    art = Layer()
    kaaba(art, KAABA_AT[0], KAABA_AT[1], 74)
    _stars(art, [(250, 120, 4), (780, 110, 9), (640, 70, 3), (380, 80, 3)], color=(255, 226, 170))
    return Image.alpha_composite(img, art.done())


def eid_adha(mark: Image.Image) -> Image.Image:
    img = grade(mark, hue=350, sat=0.95, val=0.95)
    img = Image.alpha_composite(img, glow((DOOR[0], DOOR[1] + 10), 110, (255, 214, 150), 130))
    art = Layer()
    pennants(art, 40, 984, 36, 150, [BRIGHT_GOLD, CREAM, (232, 176, 96)])
    kaaba(art, KAABA_AT[0], KAABA_AT[1], 74)
    img = erase_star(img, (512, 236))
    crescent(art, (502, 262), 30, BRIGHT_GOLD, tilt_deg=-20)
    star(art, (528, 250), 9, BRIGHT_GOLD)
    _stars(art, [(170, 300, 10), (860, 300, 10), (280, 380, 3), (750, 380, 3)], color=BRIGHT_GOLD)
    return Image.alpha_composite(img, art.done())


def new_year(mark: Image.Image) -> Image.Image:
    img = grade(mark, hue=192, sat=1.15, val=1.05)
    img = Image.alpha_composite(img, glow((512, 980), 260, (255, 200, 140), 90))
    art = Layer()
    crescent(art, (800, 150), 70, BRIGHT_GOLD, bite=0.5, tilt_deg=-40)
    _stars(art, [(220, 120, 10), (330, 70, 3), (620, 80, 4), (150, 250, 3), (900, 300, 3)])
    return Image.alpha_composite(img, art.done())


def calm_water(layer: Layer, x0: float, x1: float, y: float, color: RGB) -> None:
    """Three stacked, gently rippling bands (the sea Musa crossed — the reason for the fast)."""
    for row in range(3):
        yy = y + row * 22
        alpha = 200 - row * 55
        pts = []
        for i in range(41):
            t = i / 40
            x = x0 + (x1 - x0) * t
            pts.append((x, yy + math.sin(t * math.pi * 3 + row) * 6))
        layer.draw.line(layer.pts(pts), fill=(*color, alpha), width=int(layer.s(5)), joint="curve")


def ashura(mark: Image.Image) -> Image.Image:
    # Sober, not festive: desaturated slate-violet night, no lights or bunting.
    img = grade(mark, hue=238, sat=0.55, val=0.86)
    img = erase_star(img, (512, 236))
    art = Layer()
    crescent(art, (506, 262), 26, (214, 206, 230), bite=0.42, tilt_deg=-20)
    _stars(art, [(250, 120, 3), (780, 110, 8), (640, 70, 3), (380, 80, 3), (870, 220, 3)], color=(214, 206, 230))
    calm_water(art, 70, 300, 560, (190, 200, 228))
    calm_water(art, 724, 954, 560, (190, 200, 228))
    return Image.alpha_composite(img, art.done())


VARIANTS: Dict[str, Tuple[Callable[[Image.Image], Image.Image], RGB]] = {
    # id: (builder, adaptive background / outer fill colour)
    "ramadan": (ramadan, (22, 14, 52)),
    "lastTen": (last_ten, (12, 8, 34)),
    "eidFitr": (eid_fitr, (10, 46, 30)),
    "hajj": (hajj, (38, 28, 16)),
    "eidAdha": (eid_adha, (46, 14, 22)),
    "newYear": (new_year, (10, 36, 44)),
    "ashura": (ashura, (22, 22, 36)),
}


# --------------------------------------------------------------------------- outputs


def _clip_to_mark(decorated: Image.Image, mark: Image.Image) -> Image.Image:
    """Keep motifs inside the squircle (nothing spills past the gilt frame)."""
    out = decorated.copy()
    out.putalpha(ImageChops.multiply(decorated.split()[3], mark.split()[3]))
    return out


def _inset(img: Image.Image, size: int) -> Image.Image:
    fg_size = int(size * 0.72)
    fg = ImageOps.contain(img, (fg_size, fg_size), method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(fg, ((size - fg.width) // 2, (size - fg.height) // 2), fg)
    return canvas


def _android_layers(decorated: Image.Image, bg: RGB) -> Tuple[Image.Image, Image.Image, Image.Image]:
    """Adaptive layers — same geometry as `generate-brand-assets._generate_android_adaptive`.

    The foreground carries the gilt rim + glow like the primary icon; the monochrome
    layer uses the rim without its glow so the themed icon gets a crisp outline.
    """
    size = 432
    background = Image.new("RGB", (size, size), bg)
    foreground = _inset(brand._with_gold_rim_padded(decorated), size)
    mono_fg = _inset(_with_rim_only_padded(decorated), size)
    # Monochrome (Android 13+ themed icons tint it): the same inset geometry as the
    # foreground, keeping only what is clearly brighter than the seasonal field so the
    # field itself drops out instead of tinting as a noisy slab.
    flat = Image.alpha_composite(background.convert("RGBA"), mono_fg)
    lum = np.asarray(ImageOps.grayscale(flat.convert("RGB"))).astype(np.float32)
    field = float(np.median(lum[size // 2 - 40 : size // 2 + 40, 40:80]))
    alpha = np.clip((lum - (field + 28)) * 2.4, 0, 255).astype(np.uint8)
    mono = np.zeros((size, size, 4), dtype=np.uint8)
    mono[..., :3] = 255
    mono[..., 3] = alpha
    return foreground, background, Image.fromarray(mono, "RGBA")


def _with_rim_only_padded(img: Image.Image) -> Image.Image:
    """`brand._with_gold_rim_padded` without the glow (same padding, so same framing)."""
    pad = brand._rim_padding(img)
    canvas = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad), img)
    return brand._with_gold_rim(canvas, glow=False)


def _save(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print(f"  wrote {path.relative_to(APP_ROOT)}")


def build_all() -> Dict[str, Image.Image]:
    mark = _base_mark()
    icons: Dict[str, Image.Image] = {}
    for icon_id, (builder, bg) in VARIANTS.items():
        decorated = _clip_to_mark(builder(mark), mark)
        out_dir = OUT_ROOT / icon_id
        icon = brand._flatten_full_bleed(decorated, 1024, bg, gold_rim=True)
        _save(icon, out_dir / "icon.png")
        fg, background, mono = _android_layers(decorated, bg)
        _save(fg, out_dir / "android-foreground.png")
        _save(background, out_dir / "android-background.png")
        _save(mono, out_dir / "android-monochrome.png")
        # Pre-API-26 launchers draw the bitmap as-is: keep the squircle's transparent corners.
        legacy = brand._contain_transparent(brand._with_gold_rim_padded(decorated), 192)
        _save(legacy, out_dir / "android-legacy.png")
        _save(icon.resize((180, 180), Image.Resampling.LANCZOS), out_dir / "preview.png")
        icons[icon_id] = icon
    classic = Image.open(APP_ROOT / "assets" / "images" / "icon.png").convert("RGB")
    _save(classic.resize((180, 180), Image.Resampling.LANCZOS), OUT_ROOT / "classic" / "preview.png")
    icons = {"classic": classic, **icons}
    return icons


def contact_sheet(icons: Dict[str, Image.Image], path: Path, tile: int = 320) -> None:
    pad = 24
    cols = 4
    rows = math.ceil(len(icons) / cols)
    sheet = Image.new("RGB", (cols * (tile + pad) + pad, rows * (tile + pad) + pad), (235, 235, 235))
    mask = Image.new("L", (tile, tile), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, tile, tile), radius=int(tile * 0.225), fill=255)
    for i, (icon_id, icon) in enumerate(icons.items()):
        x = pad + (i % cols) * (tile + pad)
        y = pad + (i // cols) * (tile + pad)
        sheet.paste(icon.resize((tile, tile), Image.Resampling.LANCZOS), (x, y), mask)
    sheet.save(path)
    print(f"  wrote contact sheet {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--sheet", type=Path, help="also write a contact sheet PNG here")
    args = parser.parse_args()
    icons = build_all()
    if args.sheet:
        contact_sheet(icons, args.sheet)


if __name__ == "__main__":
    main()
