// ---------- Smooth scrolling ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
//---------- AOS (Animate On Scroll) ----------
AOS.init({
  duration: 700,
  once: true,
  offset: 80
});


// ---------- Contact form (mailto) ----------
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      if (formNote) formNote.textContent = "Please fill out all fields.";
      return;
    }

    if (formNote) formNote.textContent = "Opening your email app…";

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
  });
}

// ---------- Lightbox (works for featured carousel + any gallery grids) ----------
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxAlt = document.getElementById("lightboxAlt");
const lightboxCount = document.getElementById("lightboxCount");
const btnClose = document.getElementById("lightboxClose");
const btnPrev = document.getElementById("lightboxPrev");
const btnNext = document.getElementById("lightboxNext");

// Collect images from featured carousel + any .gallery-grid
const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));
const allImages = galleryImages;


let currentIndex = 0;

function setLightboxImage(index) {
  currentIndex = index;
  const img = allImages[currentIndex];
  const src = img.getAttribute("src");
  const alt = img.getAttribute("alt") || "Artwork";

  lightboxImage.setAttribute("src", src);
  lightboxImage.setAttribute("alt", alt);

  if (lightboxCount) lightboxCount.textContent = `${currentIndex + 1} / ${allImages.length}`;
  if (lightboxAlt) lightboxAlt.textContent = alt;
}

function openLightbox(index) {
  if (!lightbox) return;
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
  const nextIndex = (currentIndex - 1 + allImages.length) % allImages.length;
  setLightboxImage(nextIndex);
}

function nextImage() {
  const nextIndex = (currentIndex + 1) % allImages.length;
  setLightboxImage(nextIndex);
}

// Attach click to open
allImages.forEach((img, index) => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => openLightbox(index));
});

// Buttons
if (btnClose) btnClose.addEventListener("click", closeLightbox);
if (btnPrev) btnPrev.addEventListener("click", prevImage);
if (btnNext) btnNext.addEventListener("click", nextImage);

// Close when clicking backdrop
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.dataset && target.dataset.close === "true") {
      closeLightbox();
    }
  });
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("is-open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

// ---------- Featured carousel auto-slide + dots + click-to-next ----------
const track = document.getElementById("featuredTrack");
const dotsWrap = document.getElementById("featuredDots");

// Images inside the featured carousel
const featuredImages = Array.from(document.querySelectorAll(".featured-track img"));

let slideIndex = 0;
let slideTimer = null;

function renderDots() {
  if (!dotsWrap) return;

  dotsWrap.innerHTML = "";

  featuredImages.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "featured-dot" + (i === slideIndex ? " is-active" : "");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent click-to-next on the carousel container
      goToSlide(i, true);
    });
    dotsWrap.appendChild(dot);
  });
}

function goToSlide(i, userInitiated = false) {
  if (!track) return;

  slideIndex = i;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
  renderDots();

  if (userInitiated) restartAutoSlide();
}

function nextSlide() {
  if (featuredImages.length === 0) return;
  const next = (slideIndex + 1) % featuredImages.length;
  goToSlide(next);
}

function restartAutoSlide() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 3500);
}

// Init carousel
if (featuredImages.length > 0 && track) {
  goToSlide(0);
  restartAutoSlide();

  const square = track.closest(".featured-square");

  if (square) {
    // Click anywhere on the carousel to go to next slide
    square.addEventListener("click", () => {
      nextSlide();
      restartAutoSlide();
    });

    // Pause on hover (desktop)
    square.addEventListener("mouseenter", () => {
      if (slideTimer) clearInterval(slideTimer);
    });

    square.addEventListener("mouseleave", () => restartAutoSlide());
  }
}
