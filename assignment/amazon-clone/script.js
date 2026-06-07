(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function setupDropdown(triggerId, menuId, labelId, valueAttr) {
    const trigger = $(triggerId);
    const menu = $(menuId);
    if (!trigger || !menu) return;

    const label = labelId ? $(labelId) : null;

    const close = () => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      $$(".amz-dropdown").forEach((el) => {
        if (el !== menu) el.hidden = true;
      });
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden ? open() : close();
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        menu.hidden ? open() : close();
      }
    });

    $$("li", menu).forEach((item) => {
      item.addEventListener("click", () => {
        if (label && valueAttr) {
          const val = item.dataset[valueAttr] || item.textContent.trim();
          label.textContent = val.split(" - ")[0];
        }
        close();
      });
    });
  }

  document.addEventListener("click", () => {
    $$(".amz-dropdown").forEach((menu) => {
      menu.hidden = true;
    });
    $$("[aria-expanded='true']").forEach((el) => {
      el.setAttribute("aria-expanded", "false");
    });
  });

  setupDropdown("#categoryBtn", "#categoryMenu", "#categoryLabel", "value");
  setupDropdown("#langBtn", "#langMenu", "#langLabel", "value");
  setupDropdown("#accountBtn", "#accountMenu");
  setupDropdown("#allMenuBtn", "#allMenu");

  const menuToggle = $("#menuToggle");
  const sidebar = $("#mobileSidebar");
  const overlay = $("#mobileOverlay");
  const sidebarClose = $("#sidebarClose");

  const setSidebar = (open) => {
    sidebar.classList.toggle("is-open", open);
    sidebar.setAttribute("aria-hidden", String(!open));
    overlay.hidden = !open;
    requestAnimationFrame(() => overlay.classList.toggle("is-visible", open));
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  menuToggle?.addEventListener("click", () => setSidebar(true));
  sidebarClose?.addEventListener("click", () => setSidebar(false));
  overlay?.addEventListener("click", () => setSidebar(false));

  const heroTrack = $("#heroTrack");
  const heroSlides = $$(".amz-hero__slide", heroTrack);
  const heroDotsWrap = $("#heroDots");
  const heroPrev = $("#heroPrev");
  const heroNext = $("#heroNext");
  let heroIndex = 0;
  let heroTimer;

  if (heroSlides.length && heroTrack) {
    heroSlides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "amz-hero__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goHero(i));
      heroDotsWrap.appendChild(dot);
    });

    const dots = $$(".amz-hero__dot", heroDotsWrap);

    const goHero = (index) => {
      heroIndex = (index + heroSlides.length) % heroSlides.length;
      heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === heroIndex));
      heroSlides.forEach((s, i) => s.classList.toggle("is-active", i === heroIndex));
    };

    const nextHero = () => goHero(heroIndex + 1);

    heroPrev?.addEventListener("click", () => goHero(heroIndex - 1));
    heroNext?.addEventListener("click", nextHero);

    const startAuto = () => {
      clearInterval(heroTimer);
      heroTimer = setInterval(nextHero, 5000);
    };

    startAuto();
    heroTrack.closest(".amz-hero")?.addEventListener("mouseenter", () => clearInterval(heroTimer));
    heroTrack.closest(".amz-hero")?.addEventListener("mouseleave", startAuto);
  }

  $$(".amz-row-slider").forEach((section) => {
    const track = $(".amz-row-slider__track", section);
    const prev = $(".amz-row-slider__btn--prev", section);
    const next = $(".amz-row-slider__btn--next", section);
    if (!track) return;

    const scrollStep = () => Math.max(track.clientWidth * 0.75, 220);

    prev?.addEventListener("click", () => {
      track.scrollBy({ left: -scrollStep(), behavior: "smooth" });
    });

    next?.addEventListener("click", () => {
      track.scrollBy({ left: scrollStep(), behavior: "smooth" });
    });
  });

  const revealEls = $$(".amz-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  $("#backToTop")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $(".amz-search")?.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const header = $("#amzHeader");
  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 10);
    },
    { passive: true }
  );
})();
