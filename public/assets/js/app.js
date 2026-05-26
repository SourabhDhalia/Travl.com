(function () {
  // Page Loader — hide on DOMContentLoaded
  const pageLoader = document.getElementById("page-loader");
  if (pageLoader) {
    let loaderTimeout = null;

    function showLoader() {
      pageLoader.classList.remove("is-hidden");
      if (loaderTimeout) clearTimeout(loaderTimeout);
      loaderTimeout = setTimeout(hideLoader, 5000); // 5s safety net
    }

    function hideLoader() {
      pageLoader.classList.add("is-hidden");
      if (loaderTimeout) {
        clearTimeout(loaderTimeout);
        loaderTimeout = null;
      }
    }

    // Hide loader once DOM is ready (or window loads)
    hideLoader();
    window.addEventListener("load", hideLoader);

    // Show loader when navigating to a new page
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");

      // Skip empty, hash, javascript, mailto, tel links, new-tab, or download links
      if (!href ||
          href.startsWith("#") ||
          href.startsWith("javascript:") ||
          link.target === "_blank" ||
          link.hasAttribute("download") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")) {
        return;
      }

      // Parse URL to check origin and in-page anchor navigation
      try {
        const linkUrl = new URL(link.href, window.location.href);
        // Skip external links
        if (linkUrl.origin !== window.location.origin) {
          return;
        }
        // Normalize trailing slashes for pathname comparison
        const cleanLinkPath = linkUrl.pathname.replace(/\/$/, "");
        const cleanLocPath = window.location.pathname.replace(/\/$/, "");
        // Skip in-page anchor navigation (same path and search, but has hash)
        if (cleanLinkPath === cleanLocPath &&
            linkUrl.search === window.location.search &&
            linkUrl.hash) {
          return;
        }
      } catch (err) {
        // Safe fallback: if URL parsing fails, don't show loader
        return;
      }

      showLoader();

      // If navigation is prevented by another event listener, hide it in the next tick
      setTimeout(() => {
        if (e.defaultPrevented) {
          hideLoader();
        }
      }, 0);
    });

    // Handle browser back/forward (bfcache)
    window.addEventListener("pageshow", (e) => {
      hideLoader();
    });
  }

  const nav = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  function updateNavState() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });

  const parallaxSections = Array.from(document.querySelectorAll("[data-parallax-bg]"));
  const allowParallax =
    parallaxSections.length > 0 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (allowParallax) {
    let parallaxFrame = null;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function updateParallax() {
      parallaxFrame = null;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      parallaxSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;

        const speed = Number.parseFloat(section.dataset.parallaxSpeed || "0.08");
        const centerOffset = viewportHeight / 2 - (rect.top + rect.height / 2);
        const offset = clamp(centerOffset * speed, -56, 56);
        section.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      });
    }

    function requestParallaxUpdate() {
      if (parallaxFrame) return;
      parallaxFrame = window.requestAnimationFrame(updateParallax);
    }

    requestParallaxUpdate();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-rotating-words]").forEach((element) => {
    let words = [];
    try {
      words = JSON.parse(element.dataset.words || "[]");
    } catch (error) {
      words = [];
    }

    if (!words.length) return;

    if (typeof Typed !== "undefined") {
      element.textContent = "";
      const span = document.createElement("span");
      span.className = "typing-mount";
      element.appendChild(span);
      new Typed(span, {
        strings: words,
        typeSpeed: 100,
        backSpeed: 60,
        loop: true,
      });
    } else {
      let index = 0;
      window.setInterval(() => {
        index = (index + 1) % words.length;
        element.textContent = words[index];
      }, 1800);
    }
  });

  const destinations = Array.isArray(window.TRAVL_DESTINATIONS)
    ? window.TRAVL_DESTINATIONS
    : [];

  function clearResults(resultsElement) {
    resultsElement.textContent = "";
    resultsElement.classList.remove("is-open");
  }

  function renderResults(resultsElement, matches) {
    resultsElement.textContent = "";

    matches.slice(0, 6).forEach((destination) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = destination.url;
      link.textContent = `${destination.name} - ${destination.region || "India"}`;
      item.appendChild(link);
      resultsElement.appendChild(item);
    });

    resultsElement.classList.toggle("is-open", matches.length > 0);
  }

  function findMatches(value) {
    const term = value.trim().toLowerCase();
    if (!term) return [];

    return destinations.filter((destination) => {
      return [destination.name, destination.slug, destination.region]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    });
  }

  document.querySelectorAll("[data-search-root]").forEach((root) => {
    const input = root.querySelector("[data-search-input]");
    const button = root.querySelector("[data-search-button]");
    const results = root.querySelector("[data-search-results]");

    if (!input || !button || !results) return;

    input.addEventListener("input", () => {
      renderResults(results, findMatches(input.value));
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const [match] = findMatches(input.value);
        if (match) window.location.assign(match.url);
      }
    });

    button.addEventListener("click", () => {
      const [match] = findMatches(input.value);
      if (match) {
        window.location.assign(match.url);
      } else if (input.value.trim()) {
        window.location.assign(`/api/search?q=${encodeURIComponent(input.value.trim())}`);
      }
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) clearResults(results);
    });
  });

  const aiGuide = document.querySelector("[data-ai-guide]");
  if (aiGuide) {
    const aiButton = aiGuide.querySelector(".ai-guide-button");
    const aiPanel = aiGuide.querySelector(".ai-guide-panel");
    const aiClose = aiGuide.querySelector("[data-ai-close]");
    const aiForm = aiGuide.querySelector("[data-ai-form]");
    const aiInput = aiGuide.querySelector("input[name='message']");
    const aiMessages = aiGuide.querySelector("[data-ai-messages]");

    function setAiOpen(isOpen) {
      if (!aiPanel || !aiButton) return;
      aiPanel.hidden = !isOpen;
      aiButton.setAttribute("aria-expanded", String(isOpen));
      if (isOpen && aiInput) aiInput.focus();
    }

    function appendAiMessage(text, type) {
      if (!aiMessages) return;
      const message = document.createElement("p");
      message.className = `ai-message ai-message-${type}`;
      message.textContent = text;
      aiMessages.appendChild(message);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    if (aiButton) {
      aiButton.addEventListener("click", () => {
        setAiOpen(aiPanel ? aiPanel.hidden : true);
      });
    }

    if (aiClose) {
      aiClose.addEventListener("click", () => setAiOpen(false));
    }

    if (aiForm && aiInput) {
      aiForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const message = aiInput.value.trim();
        if (!message) return;

        appendAiMessage(message, "user");
        aiInput.value = "";

        // Append three-dot typing animation
        const loadingMsg = document.createElement("p");
        loadingMsg.className = "ai-message ai-message-bot ai-message-loading";
        loadingMsg.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        aiMessages.appendChild(loadingMsg);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        try {
          const response = await fetch("/api/assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
          });
          const payload = await response.json();
          loadingMsg.remove();
          appendAiMessage(payload.reply || "I could not answer that yet.", "bot");
        } catch (error) {
          loadingMsg.remove();
          appendAiMessage("I could not connect right now. Try again in a moment.", "bot");
        }
      });
    }
  }

  // 5. Vanilla JS Modal System
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.innerHTML = `
    <div class="modal-wrapper">
      <div class="modal-header">
        <h2 id="modal-title">Details</h2>
        <button class="modal-close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-spinner" id="modal-loader"></div>
        <iframe id="modal-iframe" src="about:blank" title="Details modal"></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const modalIframe = modalOverlay.querySelector("#modal-iframe");
  const modalTitle = modalOverlay.querySelector("#modal-title");
  const modalClose = modalOverlay.querySelector(".modal-close");
  const modalLoader = modalOverlay.querySelector("#modal-loader");

  function openModal(url, title) {
    modalTitle.textContent = title || "Details";
    modalLoader.style.opacity = "1";
    modalLoader.style.display = "grid";
    modalIframe.src = url;
    modalOverlay.classList.add("is-active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  function closeModal() {
    modalOverlay.classList.remove("is-active");
    document.body.style.overflow = "";
    // Wait for transition before resetting src to avoid flash
    setTimeout(() => {
      modalIframe.src = "about:blank";
    }, 300);
  }

  // Hide loader when iframe finishes loading
  modalIframe.addEventListener("load", () => {
    modalLoader.style.opacity = "0";
    setTimeout(() => {
      modalLoader.style.display = "none";
    }, 350);
  });

  document.querySelectorAll(".modal-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.dataset.modalUrl;
      const title = btn.dataset.modalTitle || btn.textContent.trim();
      if (url) openModal(url, title);
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay.classList.contains("is-active")) {
      closeModal();
    }
  });

  // 6. View Toggle Controls on destinations library page
  const btnGrid = document.getElementById("toggle-grid-view");
  const btnAlt = document.getElementById("toggle-alt-view");
  const containerGrid = document.getElementById("grid-layout-container");
  const containerAlt = document.getElementById("alt-layout-container");

  if (btnGrid && btnAlt && containerGrid && containerAlt) {
    function setView(view) {
      if (view === "alt") {
        btnAlt.classList.add("active");
        btnGrid.classList.remove("active");
        containerGrid.style.display = "none";
        containerAlt.style.display = "grid";
        localStorage.setItem("dest_layout", "alt");

        // Update pagination link layout query parameters dynamically
        document.querySelectorAll(".pagination a").forEach(a => {
          try {
            const url = new URL(a.href, window.location.href);
            url.searchParams.set("layout", "alt");
            a.href = url.pathname + url.search;
          } catch (e) {}
        });
      } else {
        btnGrid.classList.add("active");
        btnAlt.classList.remove("active");
        containerGrid.style.display = "grid";
        containerAlt.style.display = "none";
        localStorage.setItem("dest_layout", "grid");

        // Update pagination link layout query parameters dynamically
        document.querySelectorAll(".pagination a").forEach(a => {
          try {
            const url = new URL(a.href, window.location.href);
            url.searchParams.set("layout", "grid");
            a.href = url.pathname + url.search;
          } catch (e) {}
        });
      }
    }

    // Initialize from query param or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const layoutParam = urlParams.get("layout");
    const storedLayout = localStorage.getItem("dest_layout");

    if (layoutParam === "alt" || (!layoutParam && storedLayout === "alt")) {
      setView("alt");
    } else {
      setView("grid");
    }

    btnGrid.addEventListener("click", () => setView("grid"));
    btnAlt.addEventListener("click", () => setView("alt"));
  }

  // 7. Button Spinner Loader on form submissions
  document.querySelectorAll("form").forEach((form) => {
    if (form.matches("[data-ai-form]")) return; // Skip AI chatbot form

    form.addEventListener("submit", () => {
      const button = form.querySelector("button[type='submit']");
      if (button) {
        button.disabled = true;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="button-spinner"></span> Sending...';
        button.dataset.originalText = originalText;
      }
    });
  });

  // 8. Gallery Carousel & Lightbox Popup Modal System
  const gallery = document.querySelector("[data-gallery-container]");
  if (gallery) {
    const slides = Array.from(gallery.querySelectorAll(".carousel-slide"));
    const dots = Array.from(gallery.querySelectorAll(".indicator-dot"));
    const prevBtn = gallery.querySelector("[data-carousel-prev]");
    const nextBtn = gallery.querySelector("[data-carousel-next]");
    const viewAllBtn = gallery.querySelector("[data-gallery-view-all]");

    let currentSlideIndex = 0;
    let autoplayTimer = null;
    const autoplayInterval = 5000; // 5 seconds breathing slideshow

    // Function to change slide
    function showSlide(index) {
      if (slides.length === 0) return;

      // Handle index wrapping
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      // Remove active class from old slide & dot
      slides[currentSlideIndex].classList.remove("active");
      if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.remove("active");

      // Set new slide active
      currentSlideIndex = index;
      slides[currentSlideIndex].classList.add("active");
      if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add("active");

      // Reset autoplay timer
      resetAutoplay();
    }

    // Next/Prev triggers
    function nextSlide() { showSlide(currentSlideIndex + 1); }
    function prevSlide() { showSlide(currentSlideIndex - 1); }

    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Indicator Dot clicks
    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => showSlide(idx));
    });

    // Autoplay controls
    function startAutoplay() {
      if (slides.length <= 1) return;
      autoplayTimer = setInterval(nextSlide, autoplayInterval);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    startAutoplay();

    // Mobile touch swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselContainer = gallery.querySelector("[data-gallery-carousel]");
    if (carouselContainer) {
      carouselContainer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselContainer.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const threshold = 50; // swipe minimum distance in pixels
        if (touchEndX < touchStartX - threshold) {
          nextSlide(); // Swipe left -> Next
        } else if (touchEndX > touchStartX + threshold) {
          prevSlide(); // Swipe right -> Prev
        }
      }
    }

    // Popup Modal integration
    const popup = document.getElementById("gallery-popup");
    if (popup) {
      const popupGrid = popup.querySelector("#popup-grid-view");
      const popupLightbox = popup.querySelector("#popup-lightbox-view");
      const lightboxImg = popup.querySelector("#lightbox-active-img");
      const lightboxCurrentIdxSpan = popup.querySelector("#lightbox-current-idx");
      const lightboxBackToGridBtn = popup.querySelector("#lightbox-back-to-grid");
      const lightboxPrevBtn = popup.querySelector("#lightbox-prev");
      const lightboxNextBtn = popup.querySelector("#lightbox-next");
      const closePopupBtns = popup.querySelectorAll("[data-popup-close]");

      let popupImages = slides.map(slide => slide.dataset.imageUrl);
      let lightboxIndex = 0;

      function openPopup(mode, startIndex = 0) {
        popup.classList.add("is-active");
        document.body.style.overflow = "hidden"; // disable scroll
        stopAutoplay(); // stop carousel autoplay

        if (mode === "grid") {
          popupGrid.style.display = "grid";
          popupLightbox.style.display = "none";
        } else if (mode === "lightbox") {
          popupGrid.style.display = "none";
          popupLightbox.style.display = "flex";
          showLightboxImage(startIndex);
        }
      }

      function closePopup() {
        popup.classList.remove("is-active");
        document.body.style.overflow = ""; // restore scroll
        startAutoplay(); // resume carousel autoplay
      }

      function showLightboxImage(index) {
        if (index >= popupImages.length) index = 0;
        if (index < 0) index = popupImages.length - 1;

        lightboxIndex = index;
        lightboxImg.src = popupImages[lightboxIndex];
        lightboxCurrentIdxSpan.textContent = String(lightboxIndex + 1);
      }

      // View All button triggers Grid View
      if (viewAllBtn) {
        viewAllBtn.addEventListener("click", () => openPopup("grid"));
      }

      // Clicking any slide in main carousel triggers Lightbox View
      slides.forEach((slide, idx) => {
        const bgImg = slide.querySelector(".slide-bg-image");
        if (bgImg) {
          bgImg.addEventListener("click", () => openPopup("lightbox", idx));
        }
      });

      // Clicking grid item in popup triggers Lightbox View
      const gridItems = popup.querySelectorAll(".popup-grid-item");
      gridItems.forEach((item, idx) => {
        item.addEventListener("click", () => openPopup("lightbox", idx));
      });

      // Lightbox Controls
      if (lightboxBackToGridBtn) {
        lightboxBackToGridBtn.addEventListener("click", () => {
          popupGrid.style.display = "grid";
          popupLightbox.style.display = "none";
        });
      }

      if (lightboxPrevBtn) {
        lightboxPrevBtn.addEventListener("click", () => showLightboxImage(lightboxIndex - 1));
      }
      if (lightboxNextBtn) {
        lightboxNextBtn.addEventListener("click", () => showLightboxImage(lightboxIndex + 1));
      }

      // Close popup event listeners
      closePopupBtns.forEach(btn => {
        btn.addEventListener("click", closePopup);
      });

      // Key listeners for popup navigation
      window.addEventListener("keydown", (e) => {
        if (!popup.classList.contains("is-active")) return;

        if (e.key === "Escape") {
          closePopup();
        } else if (popupLightbox.style.display === "flex") {
          if (e.key === "ArrowRight") {
            showLightboxImage(lightboxIndex + 1);
          } else if (e.key === "ArrowLeft") {
            showLightboxImage(lightboxIndex - 1);
          }
        }
      });
    }
  }

  // 9. Back To Top (Scroll to Top) Button
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
})();
