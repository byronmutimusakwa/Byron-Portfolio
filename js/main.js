// ---------- Smooth scrolling (only for valid in-page anchors) ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return; // don't prevent default if target doesn't exist

    e.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    
    // Close mobile menu if open
    const nav = document.getElementById("mainNav");
    const menuToggle = document.getElementById("mobileMenuToggle");
    if (nav && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// ---------- Navbar shrink on scroll ----------
const navbar = document.querySelector(".navbar");

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle("is-scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ---------- Mobile Menu Toggle ----------
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mainNav = document.getElementById("mainNav");

if (mobileMenuToggle && mainNav) {
  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.contains("is-open");
    mainNav.classList.toggle("is-open");
    mobileMenuToggle.setAttribute("aria-expanded", !isOpen);
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      mainNav.classList.remove("is-open");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ---------- Lightbox for Portfolio Items ----------
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxAlt = document.getElementById("lightboxAlt");
const lightboxCount = document.getElementById("lightboxCount");
const btnClose = document.getElementById("lightboxClose");
const btnPrev = document.getElementById("lightboxPrev");
const btnNext = document.getElementById("lightboxNext");

// Get all portfolio images
const portfolioItems = Array.from(document.querySelectorAll(".portfolio-item"));
const portfolioImages = Array.from(document.querySelectorAll(".portfolio-item img"));

let currentIndex = 0;

function setLightboxImage(index) {
  if (!portfolioImages.length) return;

  currentIndex = index;
  const img = portfolioImages[currentIndex];
  const src = img.getAttribute("src");
  const projectName = img.closest(".portfolio-item")?.dataset.project || "Artwork";
  const alt = img.getAttribute("alt") || projectName;

  if (lightboxImage) {
    lightboxImage.setAttribute("src", src);
    lightboxImage.setAttribute("alt", alt);
  }

  if (lightboxCount) lightboxCount.textContent = `${currentIndex + 1} / ${portfolioImages.length}`;
  if (lightboxAlt) lightboxAlt.textContent = projectName;
}

function openLightbox(index) {
  if (!lightbox || !portfolioImages.length) return;
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
  const nextIndex = (currentIndex - 1 + portfolioImages.length) % portfolioImages.length;
  setLightboxImage(nextIndex);
}

function nextImage() {
  const nextIndex = (currentIndex + 1) % portfolioImages.length;
  setLightboxImage(nextIndex);
}

// Attach click handlers to portfolio items
portfolioItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

// Lightbox controls
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

// ---------- Dropdown Menu Toggle (Mobile) ----------
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    // Only prevent default on mobile (when nav is open)
    const nav = document.getElementById("mainNav");
    if (nav && nav.classList.contains("is-open")) {
      e.preventDefault();
      const dropdown = toggle.closest(".nav-dropdown");
      dropdown?.classList.toggle("active");
    }
  });

  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const dropdown = toggle.closest(".nav-dropdown");
      const menu = dropdown?.querySelector(".dropdown-menu");
      if (menu) {
        dropdown.classList.toggle("active");
      }
    }
  });
});
