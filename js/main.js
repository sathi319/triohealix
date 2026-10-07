/* ==========================================================================
   TrioHealix — site scripts
   Sticky header · mobile menu · scroll reveal · counters · contact form
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- header */
  var hdr = document.getElementById("hdr");
  function onScroll() {
    if (!hdr) return;
    hdr.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------- mobile menu */
  var burger = document.getElementById("burger");
  var mob = document.getElementById("mobile");
  function closeMobile() {
    if (!mob || !burger) return;
    mob.classList.remove("open");
    burger.classList.remove("open");
    if (hdr) hdr.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burger && mob) {
    burger.addEventListener("click", function () {
      var open = mob.classList.toggle("open");
      burger.classList.toggle("open", open);
      if (hdr) hdr.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mob.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobile);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobile();
    });
  }

  /* -------------------------------------------------------- reveal on view */
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
  }

  function initReveal() {
    var items = document.querySelectorAll(".rv");
    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min((i % 4) * 80, 240) + "ms";
      if (io) io.observe(el);
      else el.classList.add("in");
    });
  }

  /* ------------------------------------------------------------- counters */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    var duration = 1600;
    var start = performance.now();

    function fmt(n) {
      return n >= 1000 ? Math.round(n).toLocaleString("en-US") : Math.round(n).toString();
    }
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    document.querySelectorAll(".stat b[data-count]").forEach(function (el) {
      if (io) {
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                countUp(entry.target);
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 }
        );
        obs.observe(el);
      } else {
        countUp(el);
      }
    });
  }

  /* ---------------------------------------------------------- contact form */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = document.getElementById("formOk");
      if (ok) {
        ok.classList.add("show");
        form.reset();
        ok.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* ------------------------------------------------------------- footer yr */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ init */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    initReveal();
    initCounters();
  });
})();
