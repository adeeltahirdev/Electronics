/**
 * main.js — Multan Electronics
 *
 * Responsibilities:
 *  1. Cart: read/write localStorage, expose addToCart / removeFromCart / clearCart
 *  2. UI sync: cart count badge, mini-cart dropdown, mobile cart count
 *  3. "Add to Cart" button delegation (works on all pages)
 *  4. Place Order: POST cart + billing to /orders/place-order/ and show confirmation
 *  5. Hero carousel
 *  6. Category / arrival track sliding
 */

// ── 1. Cart helpers ──────────────────────────────────────────────────────────

const CART_KEY = "me_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  syncCartUI();
}

function addToCart({ id, name, price, img, qty = 1 }) {
  const cart  = getCart();
  const index = cart.findIndex(i => String(i.id) === String(id));
  if (index >= 0) {
    cart[index].qty += qty;
  } else {
    cart.push({ id: String(id), name, price: parseFloat(price), img, qty });
  }
  saveCart(cart);
  showMiniCart();
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => String(i.id) !== String(id)));
}

function clearCart() {
  saveCart([]);
}

// Expose for cart.html inline script
window.getCart   = getCart;
window.saveCart  = saveCart;
window.clearCart = clearCart;


// ── 2. UI sync ────────────────────────────────────────────────────────────────

function fmt(n) {
  return "Rs " + Number(n).toLocaleString("en-PK");
}

function syncCartUI() {
  const cart  = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Badge counts
  document.querySelectorAll(".cart-count, .mobile-cart-count")
    .forEach(el => { el.textContent = count; });

  // Mini-cart items
  const miniItems = document.getElementById("miniCartItems");
  if (miniItems) {
    if (!cart.length) {
      miniItems.innerHTML = '<p class="mini-empty">Your cart is empty.</p>';
    } else {
      miniItems.innerHTML = cart.map(item => `
        <div class="mini-cart-item">
          <img src="${item.img || ''}" alt="${item.name}" />
          <div class="mini-item-info">
            <span class="mini-item-name">${item.name}</span>
            <span class="mini-item-qty">${item.qty} × ${fmt(item.price)}</span>
          </div>
          <button class="mini-remove-btn" data-id="${item.id}">✕</button>
        </div>
      `).join("");

      miniItems.querySelectorAll(".mini-remove-btn").forEach(btn => {
        btn.addEventListener("click", e => {
          e.stopPropagation();
          removeFromCart(btn.dataset.id);
        });
      });
    }
  }

  // Mini-cart total
  const miniTotal = document.getElementById("miniCartTotal");
  if (miniTotal) miniTotal.textContent = fmt(total);
}


// ── 3. Mini-cart toggle ───────────────────────────────────────────────────────

function showMiniCart() {
  const mc = document.getElementById("miniCart");
  if (!mc) return;
  mc.classList.add("open");
  setTimeout(() => mc.classList.remove("open"), 3000);
}

function initMiniCartToggle() {
  const cartIcon = document.querySelector(".cart-icon");
  const miniCart = document.getElementById("miniCart");
  if (!cartIcon || !miniCart) return;

  // Toggle mini-cart on icon click
  cartIcon.addEventListener("click", e => {
    // Don't toggle when clicking a link inside the cart icon
    if (e.target.tagName === "A") return;

    // Toggle 'open' class
    miniCart.classList.toggle("open");
  });

  // Close mini-cart when clicking outside
  document.addEventListener("click", e => {
    // If click is outside both the cart icon and mini-cart, close it
    if (!cartIcon.contains(e.target) && !miniCart.contains(e.target)) {
      miniCart.classList.remove("open");
    }
  });

  // Optional: close when pressing Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      miniCart.classList.remove("open");
    }
  });
}


// ── 4. Add-to-cart button delegation ─────────────────────────────────────────
// Works on any page: index, all-products, product-detail

function initAddToCartButtons() {
  // Static buttons (index.html Django-rendered cards)
  document.addEventListener("click", e => {
    const btn = e.target.closest(".add-cart, .add-cart-btn");
    if (!btn) return;
    
    // Skip if this button is from product detail page (to avoid double addition)
    // Product detail page buttons have data-from="product-detail" attribute
    if (btn.dataset.from === "product-detail") {
      return;
    }
    
    e.preventDefault();

    const { id, name, price, img } = btn.dataset;
    if (!id) return;

    addToCart({ id, name, price, img });

    // Brief visual feedback
    const original = btn.textContent;
    btn.textContent = "✓ Added";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  });

  // Custom event fired by product-detail.html
  document.addEventListener("addToCart", e => {
    addToCart(e.detail);
  });
}


// ── 5. Place Order (cart.html) ────────────────────────────────────────────────
// cart.html calls this after the user fills billing details and clicks Place Order.

async function placeOrder(billingData, paymentMethod = "cod") {
  const cart    = getCart();
  const total   = cart.reduce((s, i) => s + i.price * i.qty, 0) + 250; // +shipping

  const payload = {
    items:   cart.map(i => ({ id: i.id, qty: i.qty, price: i.price })),
    billing:        billingData,
    payment_method: paymentMethod,
    total:   total,
  };

  // Read CSRF token from cookie (Django default)
  const csrfToken = getCookie("csrftoken");

  try {
    const res  = await fetch("/orders/place-order/", {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "X-CSRFToken":   csrfToken,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      clearCart();
      return { success: true, orderId: data.order_id };
    }
    return { success: false, error: data.error || "Order failed." };
  } catch (err) {
    return { success: false, error: "Network error. Please try again." };
  }
}

// Expose for cart.html inline script
window.placeOrder = placeOrder;


// ── 6. Hero Carousel ──────────────────────────────────────────────────────────

function initCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots   = document.querySelectorAll(".carousel-dots .dot");
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove("active");
    dots[current]  && dots[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current]  && dots[current].classList.add("active");
  }

  function autoPlay() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { clearInterval(timer); goTo(i); autoPlay(); });
  });

  autoPlay();
}


// ── 7. Horizontal slider (categories / arrivals) ──────────────────────────────

function initSliders() {
  // Categories
  initSlider(".categories-wrapper", ".categories-track", ".slide-btn.prev", ".slide-btn.next");
  // New Arrivals
  initSlider(".arrival-wrapper", ".arrival-track", ".arrival-btn.prev", ".arrival-btn.next");
}

function initSlider(wrapperSel, trackSel, prevSel, nextSel) {
  const wrapper = document.querySelector(wrapperSel);
  if (!wrapper) return;
  const track = wrapper.querySelector(trackSel);
  const prev  = wrapper.querySelector(prevSel);
  const next  = wrapper.querySelector(nextSel);
  if (!track || !prev || !next) return;

  const step = () => (track.querySelector("div, a")?.offsetWidth || 200) + 16;

  prev.addEventListener("click", () => { track.scrollBy({ left: -step() * 2, behavior: "smooth" }); });
  next.addEventListener("click", () => { track.scrollBy({ left:  step() * 2, behavior: "smooth" }); });
}


// ── Utility ───────────────────────────────────────────────────────────────────

function getCookie(name) {
  const val = `; ${document.cookie}`;
  const parts = val.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
}


// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  syncCartUI();
  initMiniCartToggle();
  initAddToCartButtons();
  initCarousel();
  initSliders();
});