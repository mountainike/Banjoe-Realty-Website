document.addEventListener("DOMContentLoaded", function () {
  const img = document.querySelector(".hero-media img");
  const heroMedia = document.querySelector(".hero-media");
  if (!img || !heroMedia) return;

  // Respect reduced-motion preference — no parallax movement for those users
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  // Skip on mobile: the taller mobile hero crop (see .hero-media 4/5 aspect-ratio
  // in style.css) has no vertical pan slack, and mobile Safari's address bar
  // resizing the viewport mid-scroll makes the offset math jittery anyway.
  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  if (isMobile) return;

  const speed = 0.35;      // how much slower the image moves than the page (0–1)
  // 16:9 hero container vs the photo's native 4:3 gives ~16.7% vertical slack
  // (see PROJECT_CONTEXT.md gotcha note) — stay a bit under that for safety margin.
  const maxOffsetPercent = 12;

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
