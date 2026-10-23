"""Prepare web-friendly image and media assets for the new site."""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "source-blog" / "assets"
OUT = Path(__file__).resolve().parents[1] / "public" / "assets"
IMAGES = OUT / "images"
BLOG_IMAGES = IMAGES / "journal"

COVERS = {
    "generative-ai-basics": "generative-ai-basics",
    "server-watch-dashboard": "server-watch-dashboard",
    "llm-server-spek-kecil": "llm-server-spek-kecil",
    "openclaw-ubuntu-blog-cover": "openclaw-ubuntu-blog-cover",
    "suno-ai": "suno-ai",
    "cinematic-ai": "cinematic-ai",
    "n8n": "n8n",
    "google-sheets-setup": "google-sheets-setup",
}


def webp(source: Path, destination: Path, widths: tuple[int, ...], crop: tuple[int, int] | None = None) -> None:
    image = Image.open(source).convert("RGB")
    if crop:
        image = image.crop(crop)
    for width in widths:
        if image.width > width:
            height = round(image.height * (width / image.width))
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
        else:
            resized = image.copy()
        target = destination.with_name(f"{destination.stem}-{width}{destination.suffix}")
        resized.save(target, "WEBP", quality=84, method=6)
        print(f"  {target.relative_to(OUT.parent.parent)} ({target.stat().st_size // 1024} KB)")


def make_og(portrait: Path, destination: Path) -> None:
    width, height = 1200, 630
    canvas = Image.new("RGB", (width, height), "#080a0b")

    # A soft, out-of-focus kaleidoscope of the portrait on the right.
    portrait_image = Image.open(portrait).convert("RGB")
    side = min(portrait_image.size)
    portrait_image = portrait_image.crop(
        (
            (portrait_image.width - side) // 2,
            (portrait_image.height - side) // 2,
            (portrait_image.width + side) // 2,
            (portrait_image.height + side) // 2,
        )
    ).resize((760, 760), Image.Resampling.LANCZOS)
    portrait_image = portrait_image.filter(ImageFilter.GaussianBlur(1.1))
    canvas.paste(portrait_image, (width - 660, -65))

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for x in range(width):
        alpha = int(245 * max(0, 1 - x / 820))
        draw.line([(x, 0), (x, height)], fill=(8, 10, 11, alpha))
    draw.rectangle((0, 0, width, height), fill=(8, 10, 11, 55))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)

    draw = ImageDraw.Draw(canvas)
    try:
        display = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 92)
        body = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 28)
        small = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 19)
    except OSError:
        display = ImageFont.load_default()
        body = ImageFont.load_default()
        small = ImageFont.load_default()

    draw.text((64, 74), "NANJAR BUDIMAN", font=small, fill="#c9ff57")
    draw.text((58, 136), "AI is the", font=display, fill="#f4f0e8")
    draw.text((58, 240), "instrument.", font=display, fill="#f4f0e8")
    draw.text((58, 344), "Story is the soul.", font=display, fill="#8d8a83")
    draw.text(
        (64, 512),
        "AI content creator  ·  music  ·  cinematic video  ·  Bandung, ID",
        font=body,
        fill="#d9d4ca",
    )
    draw.line((64, 482, 530, 482), fill=(201, 255, 87, 160), width=2)
    canvas.convert("RGB").save(destination, "JPEG", quality=90, optimize=True)
    print(f"  {destination.relative_to(OUT.parent.parent)} ({destination.stat().st_size // 1024} KB)")


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    BLOG_IMAGES.mkdir(parents=True, exist_ok=True)

    print("Portrait")
    webp(SRC / "images" / "nanjar.png", IMAGES / "nanjar.webp", (480, 960))
    print("Studio")
    webp(SRC / "images" / "about.jpg", IMAGES / "studio.webp", (400, 800))
    print("Album art")
    webp(SRC / "images" / "biarkan.jpg", IMAGES / "biarkan-aku-pulang.webp", (160, 640, 1280))

    print("Journal covers")
    for source_name, output_name in COVERS.items():
        source = SRC / "images" / "blog" / f"{source_name}.jpg"
        if not source.exists():
            raise FileNotFoundError(source)
        webp(source, BLOG_IMAGES / f"{output_name}.webp", (720, 1440))

    print("Work stills")
    work = IMAGES / "work"
    work.mkdir(parents=True, exist_ok=True)
    for source in sorted((Path(__file__).parent / "thumbnails").glob("*.jpg")):
        webp(source, work / f"{source.stem}.webp", (720, 1440))

    make_og(SRC / "images" / "nanjar.png", IMAGES / "og.jpg")

    print("Media")
    media = OUT / "media"
    media.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SRC / "media" / "ai_maverick.mp3", media / "ai-maverick.mp3")
    videos = OUT / "videos"
    videos.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SRC / "videos" / "hero.mp4", videos / "hero.mp4")
    for target in (media / "ai-maverick.mp3", videos / "hero.mp4"):
        print(f"  {target.relative_to(OUT.parent.parent)} ({target.stat().st_size // 1024 // 1024} MB)")


if __name__ == "__main__":
    main()
