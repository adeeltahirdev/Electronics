// main.js - Django compatible version (original structure preserved)

document.addEventListener("DOMContentLoaded", () => {

  /* ================= PRODUCTS DATA ================= */

  // Products now come from Django
  let products = window.djangoProducts || [];

  /* ================= CART ================= */

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = totalItems;
    });
  }

  function addToCart(id, qty) {

    let product;

    if (typeof id === "number") {
      product = products.find((p) => p.id === id);
    } else if (typeof id === "string") {
      product = products.find((p) => p.name === id);
    }

    if (!product) {
      console.error("Product not found:", id);
      return false;
    }

    const existingItem = cart.find((i) => i.id === product.id);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    renderMiniCart();
    renderCartPage();

    return true;
  }

  function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    renderMiniCart();
    renderCartPage();
  }

  /* ================= MINI CART ================= */

  function renderMiniCart() {

    const miniCartItems = document.getElementById("miniCartItems");
    const miniCartTotal = document.getElementById("miniCartTotal");

    if (!miniCartItems) return;

    miniCartItems.innerHTML = "";

    let total = 0;

    if (!cart.length) {

      miniCartItems.innerHTML =
        "<p style='padding:10px;color:#666;'>Your cart is empty</p>";

      if (miniCartTotal) miniCartTotal.textContent = "Rs 0";

      return;
    }

    cart.forEach((item, i) => {

      total += item.price * item.quantity;

      miniCartItems.innerHTML += `
        <div class="mini-cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="mini-cart-item-info">
            <h5>${item.name}</h5>
            <span>${item.quantity} × Rs ${item.price}</span>
          </div>
          <button class="mini-remove" data-index="${i}">&times;</button>
        </div>
      `;
    });

    if (miniCartTotal) miniCartTotal.textContent = `Rs ${total}`;

    document.querySelectorAll(".mini-remove").forEach((btn) => {

      btn.addEventListener("click", function (e) {

        e.stopPropagation();

        const index = parseInt(this.dataset.index);

        removeFromCart(index);

      });

    });

  }

  /* ================= CART PAGE ================= */

  function renderCartPage() {

    const cartItemsContainer = document.getElementById("cart-items");

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, idx) => {

      subtotal += item.price * item.quantity;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <div class="cart-product">
            <img src="${item.img}">
            <span>${item.name}</span>
          </div>
        </td>
        <td>Rs ${item.price}</td>
        <td>
          <div class="qty-wrapper">
            <button class="qty-btn minus" data-index="${idx}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn plus" data-index="${idx}">+</button>
          </div>
        </td>
        <td>Rs ${item.price * item.quantity}</td>
        <td>
          <button class="remove-item" data-index="${idx}">&times;</button>
        </td>
      `;

      cartItemsContainer.appendChild(tr);

    });

  }

  /* ================= PRODUCT CARD ================= */

  function initHomepageProducts() {

    document.querySelectorAll(".add-cart").forEach((button) => {

      button.addEventListener("click", function (e) {

        e.stopPropagation();
        e.preventDefault();

        const card = this.closest(".product-card");

        const productName = card.querySelector("h3").textContent;

        const product = products.find((p) => p.name === productName);

        if (product) {

          addToCart(product.id, 1);

        }

      });

    });

    document.querySelectorAll(".product-card").forEach((card) => {

      card.addEventListener("click", function (e) {

        if (
          e.target.closest(".add-cart") ||
          e.target.closest(".wishlist-btn")
        ) return;

        const productName = this.querySelector("h3").textContent;

        const product = products.find((p) => p.name === productName);

        if (product) {

          // Django product detail page
          window.location.href = `/products/product/${product.id}/`;

        }

      });

    });

  }

  /* ================= PRODUCT DETAIL ================= */

  function initProductDetailPage() {

    const mainImg = document.getElementById("mainImage");

    if (!mainImg) return;

    const productId = window.productId || null;

    if (!productId) return;

    const product = products.find((p) => p.id == productId);

    if (!product) return;

    document.getElementById("productTitle").textContent = product.name;

    document.getElementById("currentPrice").textContent =
      `Rs ${product.price}`;

    mainImg.src = product.img;

    const addToCartBtn = document.getElementById("addToCartBtn");

    if (addToCartBtn) {

      addToCartBtn.onclick = () => {

        addToCart(product.id, 1);

      };

    }

  }

  /* ================= AUTH MODAL ================= */

  function initAuthModal() {

    const authModal = document.getElementById("authModal");

    if (!authModal) return;

    document.querySelectorAll('.account a[href="#"]').forEach((btn) => {

      btn.onclick = (e) => {

        e.preventDefault();

        authModal.classList.add("active");

        document.body.style.overflow = "hidden";

      };

    });

  }

  /* ================= BACK TO TOP ================= */

  function initBackToTop() {

    const backToTop = document.getElementById("backToTop");

    if (!backToTop) return;

    window.onscroll = () => {

      backToTop.style.display =
        window.scrollY > 300 ? "flex" : "none";

    };

    backToTop.onclick = () => {

      window.scrollTo({ top: 0, behavior: "smooth" });

    };

  }

  /* ================= INITIALIZE ================= */

  function init() {

    updateCartCount();

    renderMiniCart();

    renderCartPage();

    initHomepageProducts();

    initProductDetailPage();

    initAuthModal();

    initBackToTop();

  }

  init();

});