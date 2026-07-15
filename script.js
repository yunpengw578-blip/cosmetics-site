const stage = document.querySelector(".stage");
const seeMoreButton = document.querySelector(".primary-link");
const backButton = document.querySelector(".back-button");

let scrollProgress = 0;
let targetProgress = 0;
let animationFrame = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function setProgress(value) {
  targetProgress = clamp(value, 0, 1);
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animateProgress);
  }
}

function animateProgress() {
  scrollProgress += (targetProgress - scrollProgress) * 0.16;
  if (Math.abs(targetProgress - scrollProgress) < 0.002) {
    scrollProgress = targetProgress;
    animationFrame = null;
  } else {
    animationFrame = requestAnimationFrame(animateProgress);
  }

  document.documentElement.style.setProperty("--scroll-progress", scrollProgress.toFixed(4));
  document.body.classList.toggle("categories-visible", scrollProgress > 0.72);
}

stage?.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const nextProgress = targetProgress + event.deltaY / 900;
    setProgress(nextProgress);
  },
  { passive: false }
);

seeMoreButton?.addEventListener("click", () => setProgress(1));
backButton?.addEventListener("click", () => setProgress(0));

document.documentElement.style.setProperty("--scroll-progress", "0");



const homeSearch = document.querySelector(".home-search");
const homeSearchInput = homeSearch?.querySelector("input");

homeSearch?.addEventListener("click", (event) => {
  event.preventDefault();
  homeSearch.classList.add("is-open");
  homeSearchInput?.focus();
});

homeSearchInput?.addEventListener("click", (event) => event.stopPropagation());
homeSearchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    homeSearchInput.value = "";
    homeSearch.classList.remove("is-open");
    homeSearchInput.blur();
  }
});

const languageMenu = document.querySelector(".language-menu");
const languageButton = document.querySelector(".language-switcher");
const languageOptions = Array.from(document.querySelectorAll(".language-options button"));

languageButton?.addEventListener("click", (event) => {
  event.preventDefault();
  const isOpen = languageMenu.classList.toggle("is-open");
  languageButton.setAttribute("aria-expanded", String(isOpen));
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const currentLang = languageButton.dataset.lang || "en";
    const nextLang = option.dataset.lang;
    const currentText = languageButton.textContent.trim();

    languageButton.dataset.lang = nextLang;
    languageButton.textContent = option.textContent.trim();
    option.dataset.lang = currentLang;
    option.textContent = currentText;
    languageMenu.classList.remove("is-open");
    languageButton.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (homeSearch && !homeSearch.contains(event.target) && !homeSearchInput?.value) {
    homeSearch.classList.remove("is-open");
  }

  if (languageMenu && !languageMenu.contains(event.target)) {
    languageMenu.classList.remove("is-open");
    languageButton?.setAttribute("aria-expanded", "false");
  }
});

const detailPage = document.querySelector(".detail-page");
const detailHeader = document.querySelector(".detail-header");

if (detailPage && detailHeader) {
  const detailBackButton = document.createElement("button");
  detailBackButton.className = "detail-back-button";
  detailBackButton.type = "button";
  detailBackButton.setAttribute("aria-label", "返回产品列表");
  detailBackButton.textContent = "< 返回";
  detailHeader.insertAdjacentElement("afterend", detailBackButton);

  const kickerText = document.querySelector(".detail-kicker")?.textContent?.toUpperCase() ?? '';
  const fallbackHref = kickerText.includes("EYE")
    ? "products-eye.html"
    : kickerText.includes("LIP")
      ? "products-lip.html"
      : kickerText.includes("TOOL")
        ? "products-tools.html"
        : "products.html";

  detailBackButton.addEventListener("click", () => {
    const referrer = document.referrer ? new URL(document.referrer, window.location.href) : null;
    const cameFromCatalog = referrer
      && referrer.origin === window.location.origin
      && /products(?:-(?:eye|lip|tools))?\.html$/.test(referrer.pathname);

    if (cameFromCatalog && window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = fallbackHref;
  });
}

const catalogSearch = document.querySelector(".catalog-search");
const catalogItems = Array.from(document.querySelectorAll(".catalog-item"));
const catalogTools = document.querySelector(".catalog-tools span");
const originalCatalogCount = catalogTools?.textContent ?? "";

if (catalogSearch) {
  const searchInput = document.createElement("input");
  searchInput.className = "catalog-search-input";
  searchInput.type = "search";
  searchInput.placeholder = "搜索产品";
  searchInput.setAttribute("aria-label", "Search products");
  catalogSearch.appendChild(searchInput);

  const filterCatalog = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    catalogItems.forEach((item) => {
      const title = item.querySelector("h2")?.textContent?.toLowerCase() ?? "";
      const imageText = item.querySelector("img")?.alt?.toLowerCase() ?? "";
      const isVisible = !keyword || title.includes(keyword) || imageText.includes(keyword);
      item.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (catalogTools && catalogItems.length) {
      catalogTools.textContent = keyword ? `${visibleCount} products` : originalCatalogCount;
    }
  };

  catalogSearch.addEventListener("click", (event) => {
    event.preventDefault();
    catalogSearch.classList.add("is-open");
    searchInput.focus();
  });

  searchInput.addEventListener("click", (event) => event.stopPropagation());
  searchInput.addEventListener("input", filterCatalog);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      filterCatalog();
      catalogSearch.classList.remove("is-open");
      searchInput.blur();
    }
  });

  document.addEventListener("click", (event) => {
    if (!catalogSearch.contains(event.target) && !searchInput.value.trim()) {
      catalogSearch.classList.remove("is-open");
      searchInput.blur();
    }
  });
}

