document.addEventListener("DOMContentLoaded", async function () {
  const grid = document.querySelector(".photo-strip, .photo-full-grid");
  const prevArrow = document.querySelector(".strip-arrow.prev");
  const nextArrow = document.querySelector(".strip-arrow.next");
  const lightbox = document.getElementById("lightbox");
  if (!grid || !lightbox) return;

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const caption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  let photos = [];
  let currentIndex = 0;

  // ---- Load the manifest and build the grid ----
  try {
    const res = await fetch("assets/images/manifest.json");
    const manifest = await res.json();

    photos = manifest.map((entry) => ({
      full: `assets/images/${entry.file}`,
      thumb: `assets/images/thumbs/${entry.file}`,
      alt: entry.caption,
    }));

    photos.forEach((photo, i) => {
      const btn = document.createElement("button");
      btn.className = "grid-item";
      btn.setAttribute("aria-label", `View photo: ${photo.alt}`);

      const img = document.createElement("img");
      img.src = photo.thumb;
      img.alt = photo.alt;
      img.loading = "lazy";

      btn.appendChild(img);
      btn.addEventListener("click", () => open(i));
      grid.appendChild(btn);
    });

    // The gallery grid above #book grows once photos are inserted, which shifts
    // anything below it. If the page loaded with a hash (e.g. a direct link to
    // #book), re-jump to it now that the layout has settled.
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView();
    }
  } catch (err) {
    console.error("Could not load photo gallery manifest:", err);
    grid.innerHTML = '<p style="grid-column: 1/-1; color: var(--ink-soft);">Photo gallery is temporarily unavailable.</p>';
    return;
  }

  // ---- Lightbox behavior ----
  function preload(index) {
    const img = new Image();
    img.src = photos[(index + photos.length) % photos.length].full;
  }

  function show(index) {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    lightboxImg.src = photo.full;
    lightboxImg.alt = photo.alt;
    caption.textContent = `${photo.alt} — ${currentIndex + 1} / ${photos.length}`;
    preload(currentIndex + 1);
    preload(currentIndex - 1);
  }

  function open(index) {
    show(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  let startX = 0;
  lightbox.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; });
  lightbox.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) show(currentIndex - 1);
    else if (diff < -50) show(currentIndex + 1);
  });

  // Safety net: if the browser restores this page from its back/forward
  // cache while the lightbox was left open, force everything back to a
  // clean closed state so the page scrollbar can never get stuck.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) close();
  });

  // ---- Strip arrow scrolling ----
  if (prevArrow && nextArrow) {
    const scrollAmount = () => grid.clientWidth * 0.8;
    prevArrow.addEventListener("click", () => {
      grid.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
    nextArrow.addEventListener("click", () => {
      grid.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  }
});
