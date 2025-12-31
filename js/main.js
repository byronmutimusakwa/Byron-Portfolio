// ---------- Smooth scrolling (only for valid in-page anchors) ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return; // don't prevent default if target doesn't exist

    e.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth" });
  });
});


// ---------- AOS (Animate On Scroll) ----------
if (window.AOS) {
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
  });
}


// ---------- Navbar shrink + transparency on scroll ----------
const navbar = document.querySelector(".navbar");

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle("is-scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll();


// ---------- Lightbox (ONLY for gallery grids, not the hero carousel) ----------
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxAlt = document.getElementById("lightboxAlt");
const lightboxCount = document.getElementById("lightboxCount");
const btnClose = document.getElementById("lightboxClose");
const btnPrev = document.getElementById("lightboxPrev");
const btnNext = document.getElementById("lightboxNext");

// only gallery images open the lightbox
const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));

let currentIndex = 0;

function setLightboxImage(index) {
  if (!galleryImages.length) return;

  currentIndex = index;
  const img = galleryImages[currentIndex];
  const src = img.getAttribute("src");
  const alt = img.getAttribute("alt") || "Artwork";

  if (lightboxImage) {
    lightboxImage.setAttribute("src", src);
    lightboxImage.setAttribute("alt", alt);
  }

  if (lightboxCount) lightboxCount.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  if (lightboxAlt) lightboxAlt.textContent = alt;
}

function openLightbox(index) {
  if (!lightbox || !galleryImages.length) return;
  setLightboxImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function prevImage() {
  const nextIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  setLightboxImage(nextIndex);
}

function nextImage() {
  const nextIndex = (currentIndex + 1) % galleryImages.length;
  setLightboxImage(nextIndex);
}

// attach click to open (gallery only)
galleryImages.forEach((img, index) => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => openLightbox(index));
});

// buttons
if (btnClose) btnClose.addEventListener("click", closeLightbox);
if (btnPrev) btnPrev.addEventListener("click", prevImage);
if (btnNext) btnNext.addEventListener("click", nextImage);

// close when clicking backdrop (anything with data-close="true")
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.dataset && target.dataset.close === "true") {
      closeLightbox();
    }
  });
}

// keyboard controls
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("is-open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});


// ---------- Featured carousel: auto-slide + dots + click-to-next ----------
const track = document.getElementById("featuredTrack");
const dotsWrap = document.getElementById("featuredDots");
const square = track ? track.closest(".featured-square") : null;

// images inside the featured carousel
const featuredImages = Array.from(document.querySelectorAll(".featured-track img"));

let slideIndex = 0;
let slideTimer = null;

function renderDots() {
  if (!dotsWrap) return;

  dotsWrap.innerHTML = "";

  featuredImages.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "featured-dot" + (i === slideIndex ? " is-active" : "");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);

    dot.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevents click-to-next on the square
      goToSlide(i, true);
    });

    dotsWrap.appendChild(dot);
  });
}

function goToSlide(i, userInitiated = false) {
  if (!track || featuredImages.length === 0) return;

  slideIndex = i;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
  renderDots();

  if (userInitiated) restartAutoSlide();
}

function nextSlide() {
  if (!track || featuredImages.length === 0) return;
  const next = (slideIndex + 1) % featuredImages.length;
  goToSlide(next);
}

function restartAutoSlide() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 3500);
}

// init carousel
if (track && featuredImages.length > 0) {
  goToSlide(0);
  restartAutoSlide();

  if (square) {
    // click anywhere on the carousel to go to next slide
    square.addEventListener("click", () => {
      nextSlide();
      restartAutoSlide();
    });

    // pause on hover
    square.addEventListener("mouseenter", () => {
      if (slideTimer) clearInterval(slideTimer);
    });

    square.addEventListener("mouseleave", () => restartAutoSlide());
  }
}
