# -*- coding: utf-8 -*-
"""Generate the 16:9 card thumbnails in img/thumb/ from the full-size assets.

The originals stay untouched and are what the detail panels show. The cards are
only ~350 CSS px wide, so shipping 500-800 KB screenshots to the grid was most
of the page weight. Run this after adding or replacing a card image:

    python tools/make-thumbs.py

Requires Pillow (`pip install pillow`). This is a one-off asset step, not a
build step -- the site itself is still plain HTML with nothing to compile.
"""
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "img", "thumb")

WIDTH = 720          # ~2x the widest the card ever renders
RATIO = 16 / 9

# (source, output name, vertical crop anchor)
JOBS = [
    ("img/p1-1/img1.jpg",  "cymatic.jpg",    "top"),
    ("img/p1-1/intro.jpg", "visualizer.jpg", "top"),
    ("img/p1-2/intro.jpg", "beat.jpg",       "top"),
    ("img/p1-3/intro.jpg", "midibook.jpg",   "top"),
    ("img/p2/intro.jpg",   "markov.jpg",     "top"),
    ("img/sd_bg.png",      "astral.jpg",     "center"),
    ("img/spook_bg.png",   "spooky.jpg",     "center"),
    ("img/m1/intro.jpg",   "m1.jpg",         "center"),
    ("img/m2/intro.jpg",   "m2.jpg",         "center"),
    ("img/m3/intro.jpg",   "m3.jpg",         "center"),
]


def crop_to_ratio(im, anchor):
    w, h = im.size
    want_h = round(w / RATIO)
    if want_h <= h:
        top = 0 if anchor == "top" else (h - want_h) // 2
        return im.crop((0, top, w, top + want_h))
    want_w = round(h * RATIO)
    left = (w - want_w) // 2
    return im.crop((left, 0, left + want_w, h))


os.makedirs(OUT, exist_ok=True)
total_in = total_out = 0

for src, name, anchor in JOBS:
    path = os.path.join(ROOT, src)
    with Image.open(path) as im:
        im = im.convert("RGB")
        im = crop_to_ratio(im, anchor)
        if im.width > WIDTH:
            im = im.resize((WIDTH, round(WIDTH / RATIO)), Image.LANCZOS)
        dest = os.path.join(OUT, name)
        im.save(dest, "JPEG", quality=82, optimize=True, progressive=True)

    a, b = os.path.getsize(path), os.path.getsize(dest)
    total_in += a
    total_out += b
    print("%-22s %6.0f KB -> %-16s %5.0f KB  (%dx%d)"
          % (src, a / 1024, name, b / 1024, im.width, im.height))

print("\ntotal %.0f KB -> %.0f KB" % (total_in / 1024, total_out / 1024))
