#!/usr/bin/env python3
"""Makes the favicon and app icons from images-originals/icon/app-icon.png (needs Pillow).

  public/favicon.ico          browser tab (16, 32, 48 px)
  public/favicon-32.png       browser tab (PNG)
  public/apple-touch-icon.png iPhone home screen (180 px, full square, no transparency)
  public/icon-192.png, icon-512.png   Android / web app manifest (rounded corners, transparent)
"""
from PIL import Image, ImageDraw, ImageFilter
import os

SRC = "images-originals/icon/app-icon.png"
OUT = "public"
img = Image.open(SRC).convert("RGBA")
w, h = img.size

# 1) Rounded version: make the white corners outside the rounded square transparent.
rounded = img.copy()
marker = (255, 0, 255, 0)
for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
    ImageDraw.floodfill(rounded, corner, marker, thresh=40)
px = rounded.load()
for y in range(h):
    for x in range(w):
        if px[x, y][:3] == (255, 0, 255):
            px[x, y] = (0, 0, 0, 0)
# eat away the thin light rim that is left from the white background
alpha = rounded.getchannel("A").filter(ImageFilter.MinFilter(9))
rounded.putalpha(alpha)
# crop to the visible rounded square
bbox = rounded.getchannel("A").getbbox()
rounded = rounded.crop(bbox)
side = max(rounded.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(rounded, ((side - rounded.width) // 2, (side - rounded.height) // 2))
rounded = sq

# 2) Full-square version for iOS: cut inwards so no corner of the rounded shape is left.
cut = int(min(w, h) * 0.088)
full = img.crop((cut, cut, w - cut, h - cut)).convert("RGB")

os.makedirs(OUT, exist_ok=True)
rounded.resize((32, 32), Image.LANCZOS).save(f"{OUT}/favicon-32.png")
rounded.resize((192, 192), Image.LANCZOS).save(f"{OUT}/icon-192.png")
rounded.resize((512, 512), Image.LANCZOS).save(f"{OUT}/icon-512.png")
full.resize((180, 180), Image.LANCZOS).save(f"{OUT}/apple-touch-icon.png")
rounded.resize((256, 256), Image.LANCZOS).save(f"{OUT}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
for f in ["favicon.ico", "favicon-32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"]:
    print(f"{OUT}/{f}", os.path.getsize(f"{OUT}/{f}") // 1024 or "<1", "KB")
