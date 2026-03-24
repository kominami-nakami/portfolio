(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("lightboxClose");
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

  const openLightbox = (img) => {
    if (!lightbox || !lightboxImage || !img) {
      return;
    }
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) {
      return;
    }
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".zoomable").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  document.querySelectorAll(".slideshow").forEach((slideshow) => {
    const mainImage = slideshow.querySelector(".slide-main");
    const thumbButtons = Array.from(slideshow.querySelectorAll(".thumb"));
    const prevButton = slideshow.querySelector(".slide-nav.prev");
    const nextButton = slideshow.querySelector(".slide-nav.next");

    if (!mainImage || thumbButtons.length === 0 || !prevButton || !nextButton) {
      return;
    }

    const slides = thumbButtons.map((button) => ({
      src: button.dataset.src,
      alt: button.dataset.alt,
    }));

    let currentIndex = Math.max(
      0,
      thumbButtons.findIndex((button) => button.classList.contains("is-active"))
    );

    const renderSlide = (index) => {
      const slide = slides[index];
      if (!slide) {
        return;
      }
      mainImage.src = slide.src;
      mainImage.alt = slide.alt;
      thumbButtons.forEach((button, idx) => {
        button.classList.toggle("is-active", idx === index);
      });
    };

    thumbButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        currentIndex = index;
        renderSlide(currentIndex);
      });
    });

    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlide(currentIndex);
    });

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlide(currentIndex);
    });

    renderSlide(currentIndex);
  });

  if (menuToggle && sideMenu) {
    const setMenuState = (open) => {
      sideMenu.classList.toggle("is-open", open);
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    };

    menuToggle.addEventListener("click", () => {
      const willOpen = !sideMenu.classList.contains("is-open");
      setMenuState(willOpen);
    });

    sideMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = sideMenu.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);
      if (!clickedInsideMenu && !clickedToggle) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });
  }
})();
