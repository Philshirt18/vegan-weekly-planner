#!/bin/bash
# Turns the original pictures in images-originals/ into what the app needs:
# JPG, 1200 x 900 pixels (4:3), quality 80, saved in public/images/.
# The original file name (without ending) must be the dish id, for example
# images-originals/red-lentil-dal.png  ->  public/images/red-lentil-dal.jpg
# Works on macOS (uses the built-in "sips").
set -e
cd "$(dirname "$0")/.."
mkdir -p public/images
count=0
for f in images-originals/*.{png,PNG,jpg,jpeg,JPG,JPEG,webp,heic}; do
  [ -f "$f" ] || continue
  name="$(basename "${f%.*}")"
  sips -s format jpeg -s formatOptions 80 -z 900 1200 "$f" --out "public/images/$name.jpg" >/dev/null
  size=$(( $(stat -f%z "public/images/$name.jpg") / 1024 ))
  echo "public/images/$name.jpg (${size} KB)"
  count=$((count + 1))
done
echo "$count picture(s) converted."
