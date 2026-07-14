const products = [
  ["洁面慕斯", "洁面", "#f8efe7"],
  ["平衡爽肤水", "爽肤水", "#d9e4dc"],
  ["玻尿酸精华", "精华", "#e8f0f6"],
  ["修护面霜", "面霜", "#f1e6dc"],
  ["亮肤眼霜", "眼部护理", "#efe7f3"],
  ["保湿面膜", "面膜", "#e5f0e8"],
  ["柔雾粉底液", "底妆", "#ead7cc"],
  ["轻透遮瑕", "底妆", "#f2dfd4"],
  ["丝绒口红", "唇妆", "#edd0d6"],
  ["润泽唇釉", "唇妆", "#f3c8d4"],
  ["四色眼影盘", "眼妆", "#ddd7eb"],
  ["极细眼线笔", "眼妆", "#d8d8dc"],
  ["纤长睫毛膏", "眼妆", "#e7e0d9"],
  ["自然眉笔", "眉妆", "#d7ccc2"],
  ["柔光腮红", "腮红", "#f0cfd0"],
  ["细闪高光", "高光", "#f5ead8"],
  ["花园香氛", "香氛", "#dfe9ef"],
  ["身体乳霜", "身体护理", "#e5e8d8"],
  ["护手霜", "身体护理", "#f4e3dc"],
  ["限定礼盒", "套装", "#e8e1d8"],
].map(([name, category, tone], index) => ({
  id: index + 1,
  name,
  category,
  tone,
  image: `./assets/products/product-${String(index + 1).padStart(2, "0")}.jpg`,
  description: `${name}适合放置高清展示图、卖点、规格和适用人群。替换图片后，网站会保留同样的简洁陈列效果。`,
}));

const grid = document.querySelector("#productGrid");
const filters = document.querySelector("#filters");
const dialog = document.querySelector("#productDialog");
const closeDialog = document.querySelector("#closeDialog");
const dialogImage = document.querySelector("#dialogImage");
const dialogCategory = document.querySelector("#dialogCategory");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogDescription = document.querySelector("#dialogDescription");
const themeToggle = document.querySelector("#themeToggle");

let activeCategory = "全部";
const categories = ["全部", ...new Set(products.map((product) => product.category))];

function createImage(product) {
  const wrapper = document.createElement("div");
  wrapper.className = "product-image";
  wrapper.style.setProperty("--tone", product.tone);

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.addEventListener("error", () => {
    img.remove();
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder-product";
    wrapper.appendChild(placeholder);
  }, { once: true });

  wrapper.appendChild(img);
  return wrapper;
}

function renderFilters() {
  filters.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter-button${category === activeCategory ? " active" : ""}`;
    button.type = "button";
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderProducts();
    });
    filters.appendChild(button);
  });
}

function renderProducts() {
  grid.innerHTML = "";
  products
    .filter((product) => activeCategory === "全部" || product.category === activeCategory)
    .forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.tabIndex = 0;
      card.appendChild(createImage(product));

      const info = document.createElement("div");
      info.className = "product-info";
      info.innerHTML = `<span>${product.category}</span><h3>${product.name}</h3>`;
      card.appendChild(info);

      card.addEventListener("click", () => openProduct(product));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter") openProduct(product);
      });
      grid.appendChild(card);
    });
}

function openProduct(product) {
  dialogImage.innerHTML = "";
  dialogImage.style.setProperty("--tone", product.tone);
  dialogImage.appendChild(createImage(product));
  dialogCategory.textContent = product.category;
  dialogTitle.textContent = product.name;
  dialogDescription.textContent = product.description;
  dialog.showModal();
}

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderFilters();
renderProducts();
