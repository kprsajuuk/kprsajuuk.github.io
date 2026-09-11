# kprsajuuk.github.io

Personal site and portfolio for Yunhan Li — <https://kprsajuuk.github.io/>

Plain HTML, CSS and JavaScript. No framework, no build step, nothing to compile:
GitHub Pages serves these files as they are.

```
index.html          the whole page, including every project write-up in <template>
css/site.css        all styles
js/site.js          category filtering + the detail panel (~150 lines, no dependencies)
img/                full-size screenshots and artwork
img/thumb/          16:9 card thumbnails, generated
resume/             résumé PDF
tools/make-thumbs.py  regenerates img/thumb/ from the originals (needs Pillow)
```

## Adding a project

1. Add a card in the `#work-grid` block of `index.html` with a `data-cat`
   (`software`, `musictech`, `games` or `music`) and a `data-project` id.
2. Add a matching `<template id="tpl-{id}">` further down with the write-up.
3. Drop the screenshot in `img/`, add it to the `JOBS` list in
   `tools/make-thumbs.py`, and run the script.
4. Update the count on the filter chip.

Heavy media — the intro video and the gameplay GIF — must stay behind a
`data-load` button so it is never part of a page load.
