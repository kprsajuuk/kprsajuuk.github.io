/* Yunhan Li — portfolio
   Two behaviours: category filtering, and the full-height detail panel.
   Detail bodies live in <template> elements so their images and iframes are
   never fetched until a card is opened. */
(function () {
  "use strict";

  var grid = document.getElementById("work-grid");
  var filters = document.getElementById("work-filters");
  var empty = document.getElementById("work-empty");
  var panel = document.getElementById("panel");
  var sheet = panel && panel.querySelector(".panel__sheet");
  var body = document.getElementById("panel-body");
  var kicker = document.getElementById("panel-kicker");
  var lastFocused = null;

  /* ---------------------------------------------------------------- filter */
  if (grid && filters) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-cat]"));

    filters.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var cat = chip.dataset.filter;

      filters.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });

      var shown = 0;
      cards.forEach(function (card) {
        var match = cat === "all" || card.dataset.cat === cat;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;

      if (history.replaceState) {
        history.replaceState(
          null,
          "",
          cat === "all" ? location.pathname + location.search : "#filter=" + cat
        );
      }
    });

    // deep link: /#filter=games
    var wanted = (location.hash.match(/^#filter=(.+)$/) || [])[1];
    if (wanted) {
      var target = filters.querySelector('.chip[data-filter="' + CSS.escape(wanted) + '"]');
      if (target) target.click();
    }
  }

  /* ----------------------------------------------------------------- panel */
  function openPanel(id, label) {
    var tpl = document.getElementById("tpl-" + id);
    if (!tpl || !panel) return;

    lastFocused = document.activeElement;
    body.innerHTML = "";
    body.appendChild(tpl.content.cloneNode(true));
    if (kicker) kicker.textContent = label || "";

    panel.hidden = false;
    document.body.classList.add("is-locked");
    sheet.scrollTop = 0;

    var close = panel.querySelector(".panel__close");
    if (close) close.focus();
  }

  function closePanel() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    document.body.classList.remove("is-locked");
    body.innerHTML = "";           // stops any playing audio/video
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (grid) {
    grid.addEventListener("click", function (e) {
      var opener = e.target.closest(".card__open");
      if (!opener) return;
      openPanel(opener.dataset.project, opener.dataset.label || "");
    });
  }

  if (panel) {
    panel.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closePanel();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });

    // keep tab focus inside the sheet while it is open
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = sheet.querySelectorAll(
        'a[href], button:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* -------------------------------------------- deferred heavy media (opt-in)
     A 71 MB mp4 and a 14 MB gif must never be part of a page load. */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-load]");
    if (!btn) return;

    var box = btn.closest(".heavy");
    var src = btn.dataset.load;
    var kind = btn.dataset.kind || "video";
    var node;

    if (kind === "video") {
      node = document.createElement("video");
      node.controls = true;
      node.preload = "metadata";
      node.playsInline = true;
      node.src = src;
    } else {
      node = document.createElement("img");
      node.alt = btn.dataset.alt || "";
      node.src = src;
    }

    btn.remove();
    var note = box.querySelector("p");
    if (note) note.remove();
    box.appendChild(node);
    if (kind === "video") node.play().catch(function () { /* autoplay blocked; user can press play */ });
  });

  /* -------------------------------------------------- footer year, nav state */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
