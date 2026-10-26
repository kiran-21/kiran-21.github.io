
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#main-nav");
  const header = document.querySelector("#site-header");
  const year = document.querySelector("#year");

  // FOOTER YEAR
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // SHARP FAVICON MATCHING THE NAVBAR
  async function createFavicon() {
    try {
      await document.fonts.load('600 208px "Fraunces"');

      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ivory background with rounded corners
      ctx.clearRect(0, 0, 256, 256);

      ctx.fillStyle = "#F7F5F0";

      ctx.beginPath();
      ctx.roundRect(0, 0, 256, 256, 52);
      ctx.fill();

      // Same font as navbar
      ctx.font = '600 208px "Fraunces"';
      ctx.textBaseline = "alphabetic";

      // Forest-green K
      ctx.fillStyle = "#324D3E";
      const x = 32;
      const baseline = 202;
      ctx.fillText("K", x, baseline);

      // Coffee-brown dot
      const kWidth = ctx.measureText("K").width;

      ctx.fillStyle = "#835E48";
      ctx.fillText(".", x + kWidth - 8, baseline);

      let favicon = document.querySelector(
        'link[rel="icon"]'
      );

      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }

      favicon.type = "image/png";
      favicon.sizes = "256x256";
      favicon.href = canvas.toDataURL("image/png");

    } catch (error) {
      console.warn("Favicon fallback in use.", error);
    }
  }

  createFavicon();

  // MOBILE NAVIGATION
  function closeMenu() {
    if (!menuToggle || !nav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const expanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (expanded) {
        closeMenu();
      } else {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute(
          "aria-label",
          "Close navigation"
        );

        nav.classList.add("open");
        document.body.classList.add("menu-open");
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) {
        closeMenu();
      }
    });
  }

  // STICKY HEADER
  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 12
    );
  }

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );

  // SCROLL REVEAL ANIMATIONS
  const revealElements =
    document.querySelectorAll("[data-reveal]");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    !reducedMotion &&
    "IntersectionObserver" in window
  ) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    document.documentElement.classList.add("js-ready");
  }
});
