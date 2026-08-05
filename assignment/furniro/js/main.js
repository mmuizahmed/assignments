/* ========================================
   Furniro — Main JavaScript
   Mobile menu, cart (localStorage), qty, gallery
   ======================================== */

const PRODUCTS = {
  asgaard: {
    id: "asgaard",
    name: "Asgaard sofa",
    desc: "Sofa",
    price: 250000,
    image: "assets/figma/product/asgaard-main.png",
    currency: "Rs",
  },
  casaliving: {
    id: "casaliving",
    name: "Casaliving Wood",
    desc: "Sofa",
    price: 270000,
    image: "assets/figma/product/casaliving.png",
    currency: "Rs",
  },
  syltherine: {
    id: "syltherine",
    name: "Syltherine",
    desc: "Stylish cafe chair",
    price: 2500000,
    oldPrice: 3500000,
    badge: "-30%",
    badgeType: "sale",
    image: "assets/figma/product/syltherine.png",
  },
  leviosa: {
    id: "leviosa",
    name: "Leviosa",
    desc: "Stylish cafe chair",
    price: 2500000,
    image: "assets/figma/product/leviosa.png",
  },
  lolito: {
    id: "lolito",
    name: "Lolito",
    desc: "Luxury big sofa",
    price: 7000000,
    oldPrice: 14000000,
    badge: "-50%",
    badgeType: "sale",
    image: "assets/figma/product/lolito.png",
  },
  respira: {
    id: "respira",
    name: "Respira",
    desc: "Outdoor bar table and stool",
    price: 500000,
    badge: "New",
    badgeType: "new",
    image: "assets/figma/product/respira.png",
  },
  grifo: {
    id: "grifo",
    name: "Grifo",
    desc: "Night lamp",
    price: 1500000,
    image: "assets/images/grifo.png",
  },
  muggo: {
    id: "muggo",
    name: "Muggo",
    desc: "Small mug",
    price: 150000,
    badge: "New",
    badgeType: "new",
    image: "assets/images/muggo.png",
  },
  pingky: {
    id: "pingky",
    name: "Pingky",
    desc: "Cute bed set",
    price: 7000000,
    oldPrice: 14000000,
    badge: "-50%",
    badgeType: "sale",
    image: "assets/images/pingky.png",
  },
  potty: {
    id: "potty",
    name: "Potty",
    desc: "Minimalist flower pot",
    price: 500000,
    badge: "New",
    badgeType: "new",
    image: "assets/images/potty.png",
  },
};

/* ---------- Helpers ---------- */
function getCartCurrency() {
  const cart = getCart();
  if (!cart.length) return "Rp";
  return cart.some((i) => i.currency === "Rs") ? "Rs" : cart[0].currency || "Rp";
}

function formatPrice(num, currency) {
  const cur = currency || getCartCurrency();
  if (cur === "Rs") {
    return (
      "Rs. " +
      Number(num)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  }
  return (
    "Rp " +
    Number(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("furniro_cart")) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("furniro_cart", JSON.stringify(cart));
  updateCartBadge();
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Cart ---------- */
function addToCart(productId, qty = 1) {
  const product = PRODUCTS[productId];
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      currency: product.currency || "Rp",
      qty: qty,
    });
  }

  saveCart(cart);
  updateCartBadge();
  renderCartSidebar();
  openCartSidebar();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  let cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
  renderCartSidebar();
  renderCheckoutSummary();
  showToast("Item removed from cart");
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.qty = Math.max(1, parseInt(qty, 10) || 1);
  saveCart(cart);
  renderCartPage();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-badge");
  const count = getCartCount();
  badges.forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
  });
}

/* ---------- Cart Page ---------- */
function renderCartPage() {
  const tbody = document.getElementById("cart-body");
  const totalsBox = document.getElementById("cart-totals");
  const emptyBox = document.getElementById("cart-empty");
  const cartLayout = document.getElementById("cart-layout");

  if (!tbody) return;

  const cart = getCart();

  if (cart.length === 0) {
    tbody.innerHTML = "";
    if (cartLayout) cartLayout.style.display = "none";
    if (emptyBox) emptyBox.style.display = "block";
    return;
  }

  if (cartLayout) cartLayout.style.display = "grid";
  if (emptyBox) emptyBox.style.display = "none";

  tbody.innerHTML = cart
    .map(
      (item) => `
    <tr>
      <td class="col-product">
        <div class="cart-product">
          <div class="cart-product-thumb">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <span>${item.name}</span>
        </div>
      </td>
      <td class="col-price"><span class="cart-price">${formatPrice(item.price, item.currency)}</span></td>
      <td class="col-qty">
        <div class="cart-qty">
          <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty-input" aria-label="Quantity" />
        </div>
      </td>
      <td class="col-subtotal"><span class="cart-line-subtotal">${formatPrice(item.price * item.qty, item.currency)}</span></td>
      <td class="col-remove">
        <button type="button" class="cart-remove" data-id="${item.id}" aria-label="Remove">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `
    )
    .join("");

  const subtotal = getCartTotal();
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  const cur = getCartCurrency();
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal, cur);
  if (totalEl) totalEl.textContent = formatPrice(subtotal, cur);

  tbody.querySelectorAll(".cart-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });

  tbody.querySelectorAll(".cart-qty-input").forEach((input) => {
    input.addEventListener("change", () => {
      updateCartQty(input.dataset.id, input.value);
    });
  });
}

/* ---------- Checkout Page ---------- */
function renderCheckoutSummary() {
  const list = document.getElementById("order-items");
  if (!list) return;

  const cart = getCart();
  if (cart.length === 0) {
    list.innerHTML = `<div class="order-item"><span class="name">Your cart is empty</span></div>`;
  } else {
    list.innerHTML = cart
      .map(
        (item) => `
      <div class="order-item">
        <span class="name">
          ${item.name}
          <span class="x">X</span>
          <span class="qty">${item.qty}</span>
        </span>
        <span class="line-price">${formatPrice(item.price * item.qty, item.currency)}</span>
      </div>
    `
      )
      .join("");
  }

  const subtotal = getCartTotal();
  const cur = getCartCurrency();
  const subEl = document.getElementById("order-subtotal");
  const totalEl = document.getElementById("order-total");
  if (subEl) subEl.textContent = formatPrice(subtotal, cur);
  if (totalEl) totalEl.textContent = formatPrice(subtotal, cur);
}

function initCheckoutPayment() {
  const options = document.querySelectorAll(".payment-option");
  if (!options.length) return;

  const sync = () => {
    options.forEach((opt) => {
      const input = opt.querySelector('input[type="radio"]');
      opt.classList.toggle("active", !!(input && input.checked));
    });
  };

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const input = opt.querySelector('input[type="radio"]');
      if (input) input.checked = true;
      sync();
    });
  });
  sync();
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      }
    });
  });
}

/* ---------- Qty Buttons (product page) ---------- */
function initQtyControls() {
  document.querySelectorAll(".qty-control").forEach((control) => {
    const input = control.querySelector("input");
    const minus = control.querySelector("[data-qty='minus']");
    const plus = control.querySelector("[data-qty='plus']");

    if (minus) {
      minus.addEventListener("click", () => {
        input.value = Math.max(1, parseInt(input.value, 10) - 1);
      });
    }
    if (plus) {
      plus.addEventListener("click", () => {
        input.value = parseInt(input.value, 10) + 1;
      });
    }
  });
}

/* ---------- Product Gallery ---------- */
function initGallery() {
  const mainImg = document.getElementById("main-product-img");
  const thumbs = document.querySelectorAll(".thumbs img");
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImg.src = thumb.src;
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

/* ---------- Tabs ---------- */
function initTabs() {
  const buttons = document.querySelectorAll(".tabs-nav button");
  const panels = document.querySelectorAll(".tab-panel");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });
}

/* ---------- Size / Color selectors ---------- */
function initOptionSelectors() {
  document.querySelectorAll(".size-options").forEach((group) => {
    group.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });

  document.querySelectorAll(".color-options").forEach((group) => {
    group.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });
}

/* ---------- Add to cart buttons ---------- */
function initAddToCartButtons() {
  document.querySelectorAll("[data-add-cart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.addCart;
      let qty = 1;
      const qtyInput = document.getElementById("product-qty");
      if (qtyInput) qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      addToCart(id, qty);
    });
  });
}

/* ---------- Newsletter ---------- */
function initNewsletter() {
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (input && input.value.trim()) {
        showToast("Subscribed successfully!");
        input.value = "";
      }
    });
  });
}

/* ---------- Contact / Checkout forms ---------- */
function initForms() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Message sent! We'll get back to you soon.");
      contactForm.reset();
    });
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (getCart().length === 0) {
        showToast("Your cart is empty");
        return;
      }
      localStorage.removeItem("furniro_cart");
      updateCartBadge();
      showToast("Order placed successfully!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  }
}

/* ---------- Active nav link ---------- */
function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });
}

/* ---------- Cart Sidebar (Figma Cart Sidebar) ---------- */
function ensureCartSidebar() {
  if (document.getElementById("cart-sidebar")) return;

  const wrap = document.createElement("div");
  wrap.id = "cart-sidebar";
  wrap.innerHTML = `
    <div class="cart-sidebar-backdrop" data-close-sidebar></div>
    <aside class="cart-sidebar-panel" aria-label="Shopping Cart">
      <div class="cart-sidebar-header">
        <h3>Shopping Cart</h3>
        <button type="button" class="cart-sidebar-close" data-close-sidebar aria-label="Close">
          <img src="assets/figma/icons/bag-close.svg" alt="" width="16" height="19" />
        </button>
      </div>
      <div class="cart-sidebar-divider"></div>
      <div class="cart-sidebar-items" id="cart-sidebar-items"></div>
      <div class="cart-sidebar-footer">
        <div class="cart-sidebar-subtotal">
          <span>Subtotal</span>
          <strong id="cart-sidebar-subtotal">Rs. 0.00</strong>
        </div>
        <div class="cart-sidebar-divider full"></div>
        <div class="cart-sidebar-actions">
          <a href="cart.html">Cart</a>
          <a href="checkout.html">Checkout</a>
          <a href="comparison.html">Comparison</a>
        </div>
      </div>
    </aside>
  `;
  document.body.appendChild(wrap);

  wrap.querySelectorAll("[data-close-sidebar]").forEach((el) => {
    el.addEventListener("click", closeCartSidebar);
  });
}

function openCartSidebar() {
  ensureCartSidebar();
  renderCartSidebar();
  document.getElementById("cart-sidebar")?.classList.add("open");
  document.body.classList.add("sidebar-open");
}

function closeCartSidebar() {
  document.getElementById("cart-sidebar")?.classList.remove("open");
  document.body.classList.remove("sidebar-open");
}

function renderCartSidebar() {
  ensureCartSidebar();
  const list = document.getElementById("cart-sidebar-items");
  const subEl = document.getElementById("cart-sidebar-subtotal");
  if (!list) return;

  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `<p class="cart-sidebar-empty">Your cart is empty.</p>`;
  } else {
    list.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-sidebar-item">
        <div class="cart-sidebar-thumb">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-sidebar-info">
          <p class="name">${item.name}</p>
          <p class="meta">
            <span>${item.qty}</span>
            <span class="x">X</span>
            <span class="price">${formatPrice(item.price, item.currency)}</span>
          </p>
        </div>
        <button type="button" class="cart-sidebar-remove" data-id="${item.id}" aria-label="Remove">
          <img src="assets/figma/icons/close-x.svg" alt="" width="20" height="20" />
        </button>
      </div>`
      )
      .join("");
  }

  if (subEl) subEl.textContent = formatPrice(getCartTotal(), getCartCurrency());

  list.querySelectorAll(".cart-sidebar-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.id);
      renderCartSidebar();
    });
  });
}

function initCartSidebarTriggers() {
  ensureCartSidebar();
  document.querySelectorAll('a[href="cart.html"]').forEach((link) => {
    if (!link.closest(".cart-sidebar-actions") && !link.closest(".cart-totals")) {
      link.addEventListener("click", (e) => {
        // Header cart icon opens sidebar like Figma; keep page links working via sidebar buttons
        if (link.closest(".header-icons")) {
          e.preventDefault();
          openCartSidebar();
        }
      });
    }
  });
}

/* ---------- Inspiration slider ---------- */
function initInspirationSlider() {
  const track = document.querySelector(".inspiration-slider");
  const dots = document.querySelectorAll(".inspo-dots span");
  const nextBtn = document.querySelector(".inspo-next");
  if (!track || !dots.length) return;

  const slides = track.querySelectorAll(".inspo-slide");
  let index = 0;

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
    dots.forEach((d, di) => d.classList.toggle("active", di === index % dots.length));
  };

  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
  nextBtn?.addEventListener("click", () => goTo(index + 1));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initQtyControls();
  initGallery();
  initTabs();
  initOptionSelectors();
  initAddToCartButtons();
  initNewsletter();
  initForms();
  setActiveNav();
  updateCartBadge();
  renderCartPage();
  renderCheckoutSummary();
  initCheckoutPayment();
  initCartSidebarTriggers();
  initInspirationSlider();
});
