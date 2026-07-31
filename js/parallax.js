document.addEventListener("DOMContentLoaded", function () {
  const img = document.querySelector(".hero-media img");
  const heroMedia = document.querySelector(".hero-media");
  if (!img || !heroMedia) return;

  // Respect reduced-motion preference — no parallax movement for those users
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const speed = 0.35;      // how much slower the image moves than the page (0–1)
  const maxOffsetPercent = 16; // must stay within the CSS top:-16% / height:132% buffer

  let ticking = false;

  function updateParallax() {
    const rect = heroMedia.getBoundingClientRect();
    const heroHeight = rect.height;
    // How far the hero has scrolled past the top of the viewport (0 = hero at top of page)
    const scrolled = -rect.top;
    let offsetPx = scrolled * speed;

    // Clamp so the image never scrolls far enough to reveal an edge
    const maxOffsetPx = (maxOffsetPercent / 100) * heroHeight;
    if (offsetPx > maxOffsetPx) offsetPx = maxOffsetPx;
    if (offsetPx < -maxOffsetPx) offsetPx = -maxOffsetPx;

    img.style.transform = `translateY(${offsetPx}px)`;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateParallax();
});
