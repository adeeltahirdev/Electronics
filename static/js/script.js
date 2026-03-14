document.addEventListener("DOMContentLoaded", () => {
  /* ================= HERO SLIDER ================= */
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    slides[index]?.classList.add("active");
    dots[index]?.classList.add("active");
    currentSlide = index;
  }

  if (slides.length) {
    setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
  }
  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

  /* ================= CATEGORY SLIDER ================= */
  const catTrack = document.querySelector(".categories-track");
  const catNext = document.querySelector(".slide-btn.next");
  const catPrev = document.querySelector(".slide-btn.prev");

  if (catTrack && catNext && catPrev) {
    let cards = catTrack.querySelectorAll(".category-card");
    const gap = 20;
    let cardWidth = cards[0].offsetWidth + gap;
    let index = 1;

    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);
    catTrack.appendChild(firstClone);
    catTrack.insertBefore(lastClone, cards[0]);
    cards = catTrack.querySelectorAll(".category-card");

    catTrack.style.transform = `translateX(${-cardWidth * index}px)`;

    catNext.onclick = () => {
      index++;
      catTrack.style.transition = "0.4s";
      catTrack.style.transform = `translateX(${-cardWidth * index}px)`;
    };
    catPrev.onclick = () => {
      index--;
      catTrack.style.transition = "0.4s";
      catTrack.style.transform = `translateX(${-cardWidth * index}px)`;
    };

    catTrack.addEventListener("transitionend", () => {
      if (cards[index] === firstClone) {
        catTrack.style.transition = "none";
        index = 1;
        catTrack.style.transform = `translateX(${-cardWidth * index}px)`;
      }
      if (cards[index] === lastClone) {
        catTrack.style.transition = "none";
        index = cards.length - 2;
        catTrack.style.transform = `translateX(${-cardWidth * index}px)`;
      }
    });
  }

  /* ================= PRODUCTS DATA ================= */
  // Create detailed products data that matches your homepage products
  let products = [
    // Arduino Products
    {
      id: 1,
      name: "Arduino UNO R3",
      price: 2499,
      img: "img/cnc.webp",
      description:
        "Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header and a reset button.",
      categories: ["Microcontrollers", "Arduino"],
      gallery: ["img/cnc.webp", "img/filament.webp", "img/3dprinter.webp"],
      notes: [
        "Compatible with Arduino IDE",
        "Includes USB cable",
        "ATmega328P microcontroller",
      ],
    },

    {
      id: 2,
      name: "ESP32 Dev Board",
      price: 3200,
      img: "img/cnc.webp",
      description:
        "ESP32 Development Board with WiFi and Bluetooth connectivity, dual-core processor, and multiple GPIO pins for IoT projects.",
      categories: ["Microcontrollers", "ESP32"],
      gallery: ["img/cnc.webp", "img/filament.webp"],
      notes: [
        "WiFi & Bluetooth",
        "Dual-core processor",
        "Low power consumption",
      ],
    },

    {
      id: 3,
      name: "Laser Module 5W",
      price: 8500,
      img: "img/cnc.webp",
      description:
        "5W laser module for CNC engraving and cutting machines. Suitable for wood, acrylic, leather, and other materials.",
      categories: ["Laser Modules", "CNC Parts"],
      gallery: ["img/cnc.webp"],
      notes: ["5W output power", "Water cooling required", "Includes driver"],
    },

    {
      id: 4,
      name: "3D Printer Nozzle",
      price: 650,
      img: "img/cnc.webp",
      description:
        "Brass nozzle for 3D printers with 0.4mm diameter. Compatible with most FDM 3D printers.",
      categories: ["3D Printer Parts", "Accessories"],
      gallery: ["img/cnc.webp"],
      notes: ["0.4mm diameter", "Brass material", "MK8 compatible"],
    },

    {
      id: 5,
      name: "PLA Filament 1KG",
      price: 4800,
      img: "img/cnc.webp",
      description:
        "1KG spool of PLA filament in various colors. Environmentally friendly, biodegradable material for 3D printing.",
      categories: ["3D Printer Filaments", "Consumables"],
      gallery: ["img/cnc.webp", "img/filament.webp"],
      notes: [
        "1.75mm diameter",
        "Multiple colors available",
        "±0.03mm tolerance",
      ],
    },

    // Featured Products
    {
      id: 6,
      name: "Arduino Mega 2560",
      price: 5500,
      img: "img/filament.webp",
      description:
        "Arduino Mega 2560 is a microcontroller board based on the ATmega2560. It has 54 digital input/output pins, 16 analog inputs, 4 UARTs, a 16 MHz crystal oscillator, a USB connection, a power jack, an ICSP header, and a reset button.",
      categories: ["Microcontrollers", "Arduino"],
      gallery: ["img/filament.webp", "img/cnc.webp"],
      notes: [
        "54 digital I/O pins",
        "16 analog inputs",
        "4 UART hardware serial ports",
      ],
    },

    {
      id: 7,
      name: "ESP32 CAM Module",
      price: 3800,
      img: "img/filament.webp",
      description:
        "ESP32 CAM Module with OV2640 camera, perfect for IoT projects requiring image capture and WiFi connectivity.",
      categories: ["Microcontrollers", "ESP32", "Camera"],
      gallery: ["img/filament.webp"],
      notes: ["OV2640 camera", "Built-in flash", "MicroSD card slot"],
    },

    {
      id: 8,
      name: "NEMA 17 Stepper Motor",
      price: 2200,
      img: "img/filament.webp",
      description:
        "NEMA 17 stepper motor with 1.8° step angle, 12V voltage, commonly used in 3D printers and CNC machines.",
      categories: ["Motors", "3D Printer Parts", "CNC Parts"],
      gallery: ["img/filament.webp"],
      notes: ["1.8° step angle", "12V operating voltage", "4-wire bipolar"],
    },

    // More products to reach 40
    {
      id: 9,
      name: "Arduino UNO R4",
      price: 3900,
      img: "img/filament.webp",
      description: "Latest Arduino UNO R4 with enhanced features",
      categories: ["Microcontrollers", "Arduino"],
      gallery: ["img/filament.webp"],
      notes: ["Latest model", "Enhanced performance"],
    },

    {
      id: 10,
      name: "Smart Home Automation",
      price: 18000,
      img: "img/accessories.webp",
      description: "Complete smart home automation system with Arduino control",
      categories: ["Projects", "Home Automation"],
      gallery: ["img/accessories.webp"],
      notes: ["Complete kit", "Includes sensors", "Mobile app control"],
    },
  ];

  // Add more dummy products to reach 40
  for (let i = 11; i <= 40; i++) {
    products.push({
      id: i,
      name: `Dummy Product ${i}`,
      price: Math.floor(Math.random() * 5000) + 500,
      img: i % 2 === 0 ? "img/cnc.webp" : "img/filament.webp",
      description: `This is a detailed description for Dummy Product ${i}`,
      categories: ["Category A", "Category B"],
      gallery: ["img/cnc.webp", "img/filament.webp", "img/3dprinter.webp"],
      notes: ["Note 1", "Note 2", "Note 3"],
    });
  }

  /* ================= HOMEPAGE PRODUCTS INTERACTIVITY ================= */
  function initializeHomepageProducts() {
    // Add to cart buttons on homepage - NEW ARRIVAL section
    document.querySelectorAll(".new-arrival .add-cart").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();

        // Find the product card
        const card = this.closest(".product-card");
        if (!card) return;

        // Extract product info from the card
        const productName =
          card.querySelector("h3")?.textContent || "Unknown Product";
        const priceText = card.querySelector(".price")?.textContent || "Rs 0";
        const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
        const imgSrc = card.querySelector("img")?.src || "img/default.webp";

        // Find matching product in products array
        const product = products.find((p) => p.name === productName);

        if (product) {
          // Use the product ID from products array
          addToCart(product.id, 1);

          // Show feedback
          const originalText = this.textContent;
          this.textContent = "Added!";
          this.style.backgroundColor = "#4CAF50";
          setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = "";
          }, 1000);
        } else {
          // If product not found in array, create a temporary one
          const productId = productName.toLowerCase().replace(/\s+/g, "-");

          // Add to cart
          const existingItem = cart.find((item) => item.name === productName);
          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.push({
              id: productId,
              name: productName,
              price: price,
              img: imgSrc,
              quantity: 1,
            });
          }

          // Update storage and UI
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          renderMiniCart();

          // Show feedback
          const originalText = this.textContent;
          this.textContent = "Added!";
          this.style.backgroundColor = "#4CAF50";
          setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = "";
          }, 1000);
        }
      });
    });

    // Add to cart buttons on homepage - FEATURED PRODUCTS sections
    document
      .querySelectorAll(".product-section .add-cart")
      .forEach((button) => {
        button.addEventListener("click", function (e) {
          e.stopPropagation();
          e.preventDefault();

          // Find the product card
          const card = this.closest(".product-card");
          if (!card) return;

          // Extract product info from the card
          const productName =
            card.querySelector("h3")?.textContent || "Unknown Product";
          const priceText = card.querySelector(".price")?.textContent || "Rs 0";
          const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
          const imgSrc = card.querySelector("img")?.src || "img/default.webp";

          // Find matching product in products array
          const product = products.find((p) => p.name === productName);

          if (product) {
            // Use the product ID from products array
            addToCart(product.id, 1);

            // Show feedback
            const originalText = this.textContent;
            this.textContent = "Added!";
            this.style.backgroundColor = "#4CAF50";
            setTimeout(() => {
              this.textContent = originalText;
              this.style.backgroundColor = "";
            }, 1000);
          } else {
            // If product not found in array, create a temporary one
            const productId = productName.toLowerCase().replace(/\s+/g, "-");

            // Add to cart
            const existingItem = cart.find((item) => item.name === productName);
            if (existingItem) {
              existingItem.quantity++;
            } else {
              cart.push({
                id: productId,
                name: productName,
                price: price,
                img: imgSrc,
                quantity: 1,
              });
            }

            // Update storage and UI
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            renderMiniCart();

            // Show feedback
            const originalText = this.textContent;
            this.textContent = "Added!";
            this.style.backgroundColor = "#4CAF50";
            setTimeout(() => {
              this.textContent = originalText;
              this.style.backgroundColor = "";
            }, 1000);
          }
        });
      });

    // Navigation to detail page on product card click - NEW ARRIVAL section
    document.querySelectorAll(".new-arrival .product-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        // Don't navigate if clicking on buttons
        if (
          e.target.closest(".add-cart") ||
          e.target.closest(".wishlist-btn") ||
          e.target.classList.contains("wishlist-btn")
        ) {
          return;
        }

        // Extract product info
        const productName = this.querySelector("h3")?.textContent || "";

        // Find matching product in products array
        const product = products.find((p) => p.name === productName);

        if (product) {
          // Store the actual product ID in localStorage
          localStorage.setItem("selectedProductId", product.id);
        } else {
          // Create a temporary ID
          const productId = productName.toLowerCase().replace(/\s+/g, "-");
          localStorage.setItem("selectedProductId", productId);
        }

        window.location.href = "product-detail.html";
      });
    });

    // Navigation to detail page on product card click - FEATURED PRODUCTS sections
    document
      .querySelectorAll(".product-section .product-card")
      .forEach((card) => {
        card.addEventListener("click", function (e) {
          // Don't navigate if clicking on buttons
          if (
            e.target.closest(".add-cart") ||
            e.target.closest(".wishlist-btn") ||
            e.target.classList.contains("wishlist-btn")
          ) {
            return;
          }

          // Extract product info
          const productName = this.querySelector("h3")?.textContent || "";

          // Find matching product in products array
          const product = products.find((p) => p.name === productName);

          if (product) {
            // Store the actual product ID in localStorage
            localStorage.setItem("selectedProductId", product.id);
          } else {
            // Create a temporary ID
            const productId = productName.toLowerCase().replace(/\s+/g, "-");
            localStorage.setItem("selectedProductId", productId);
          }

          window.location.href = "product-detail.html";
        });
      });

    // Wishlist buttons on homepage
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();

        // Toggle active state
        this.classList.toggle("active");

        // Change icon based on state
        const icon = this.querySelector("ion-icon");
        if (icon) {
          if (this.classList.contains("active")) {
            icon.setAttribute("name", "heart");
            icon.style.color = "#e74c3c";
          } else {
            icon.setAttribute("name", "heart-outline");
            icon.style.color = "";
          }
        }
      });
    });
  }

  /* ================= NEW ARRIVAL SLIDER ================= */
  function initializeNewArrivalSlider() {
    const arrivalTrack = document.querySelector(".arrival-track");
    const arrivalNext = document.querySelector(".arrival-btn.next");
    const arrivalPrev = document.querySelector(".arrival-btn.prev");

    if (!arrivalTrack || !arrivalNext || !arrivalPrev) return;

    let cards = arrivalTrack.querySelectorAll(".product-card");
    if (cards.length === 0) return;

    const gap = 20;
    let cardWidth = cards[0].offsetWidth + gap;
    let index = 0;

    // Calculate how many cards to show based on container width
    function updateSlider() {
      const containerWidth = arrivalTrack.parentElement.offsetWidth;
      const visibleCards = Math.floor(containerWidth / cardWidth);
      const maxIndex = Math.max(0, cards.length - visibleCards);

      arrivalNext.onclick = () => {
        if (index < maxIndex) {
          index++;
          arrivalTrack.style.transition = "transform 0.3s ease";
          arrivalTrack.style.transform = `translateX(${-index * cardWidth}px)`;
        }
      };

      arrivalPrev.onclick = () => {
        if (index > 0) {
          index--;
          arrivalTrack.style.transition = "transform 0.3s ease";
          arrivalTrack.style.transform = `translateX(${-index * cardWidth}px)`;
        }
      };
    }

    // Initial setup
    updateSlider();

    // Update on window resize
    window.addEventListener("resize", () => {
      cardWidth = cards[0].offsetWidth + gap;
      arrivalTrack.style.transition = "none";
      arrivalTrack.style.transform = `translateX(${-index * cardWidth}px)`;
      updateSlider();
    });
  }

  /* ================= ALL PRODUCTS PAGE ================= */
  const productsGrid = document.getElementById("productsGrid");
  const sortSelect = document.getElementById("sortBy");
  const paginationEl = document.getElementById("pagination");
  const productsPerPage = 32;
  let currentPage = 1;

  function renderProducts(list = products, page = 1) {
    if (!productsGrid) return;

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;

    productsGrid.innerHTML = "";
    list.slice(start, end).forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">Rs ${p.price}</p>
        <button class="wishlist-btn">♥</button>
        <button class="add-cart" data-id="${p.id}">Add to Cart</button>
      `;
      productsGrid.appendChild(card);

      // Navigate to detail page
      card.addEventListener("click", (e) => {
        if (
          !e.target.classList.contains("add-cart") &&
          !e.target.classList.contains("wishlist-btn")
        ) {
          localStorage.setItem("selectedProductId", p.id);
          location.href = "product-detail.html";
        }
      });

      // Wishlist toggle
      card.querySelector(".wishlist-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        e.target.classList.toggle("active");
      });

      // Add to cart with visual feedback
      card.querySelector(".add-cart")?.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(p.id, 1);

        // Show visual feedback
        const button = e.target;
        const originalText = button.textContent;
        button.textContent = "Added!";
        button.style.backgroundColor = "#4CAF50";

        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = "";
        }, 1000);
      });
    });

    renderPagination(list);
  }

  function renderPagination(list) {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";
    const total = Math.ceil(list.length / productsPerPage);

    for (let i = 1; i <= total; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.onclick = () => {
        currentPage = i;
        renderProducts(list, currentPage);
      };
      paginationEl.appendChild(btn);
    }
  }

  /* ================= CART ================= */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = totalItems;
    });
  }

  function addToCart(id, qty) {
    // Check if id is a string (from homepage) or number (from products array)
    let product;

    if (typeof id === "number") {
      // Find by numeric ID
      product = products.find((p) => p.id === id);
    } else if (typeof id === "string") {
      // Find by name (string ID)
      product = products.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, "-") === id,
      );
      if (!product) {
        // Try to find by exact name
        product = products.find((p) => p.name === id);
      }
    }

    if (!product) {
      console.error("Product not found:", id);
      return;
    }

    const item = cart.find((i) => i.id === product.id);
    if (item) {
      item.quantity += qty;
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

    // If on checkout page, update it too
    if (typeof updateOrderSummary === "function") {
      updateOrderSummary();
    }
  }

  /* ================= MINI CART ================= */
  const miniCartItems = document.getElementById("miniCartItems");
  const miniCartTotal = document.getElementById("miniCartTotal");

  function renderMiniCart() {
    if (!miniCartItems) return;

    miniCartItems.innerHTML = "";
    let total = 0;

    if (!cart.length) {
      miniCartItems.innerHTML =
        "<p style='padding: 10px; color: #666;'>Your cart is empty</p>";
      miniCartTotal.textContent = "Rs 0";
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
          <button class="mini-remove" data-i="${i}">&times;</button>
        </div>
      `;
    });

    miniCartTotal.textContent = `Rs ${total}`;

    document.querySelectorAll(".mini-remove").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        cart.splice(btn.dataset.i, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderMiniCart();
        renderCartPage();

        // If on checkout page, update it too
        if (typeof updateOrderSummary === "function") {
          updateOrderSummary();
        }
      };
    });
  }

  /* ================= CART PAGE ================= */
  const cartItemsContainer = document.getElementById("cart-items");
  const cartLeft = document.querySelector(".cart-left");
  const cartRight = document.querySelector(".cart-right");
  const emptyCartEl = document.getElementById("empty-cart");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartTotalEl = document.getElementById("cart-total");
  const updateCartBtn = document.getElementById("update-cart");
  const shippingInputs = document.querySelectorAll('input[name="ship"]');

  function renderCartPage() {
    console.log("renderCartPage called. Cart length:", cart.length);

    if (!cartItemsContainer) {
      console.error("cartItemsContainer not found!");
      return;
    }

    if (!cart.length) {
      console.log("Cart is empty. Showing empty cart message.");

      if (emptyCartEl) {
        console.log("Found emptyCartEl, showing it.");
        emptyCartEl.style.display = "block";
      } else {
        console.error("emptyCartEl not found!");
      }

      if (cartLeft) {
        console.log("Found cartLeft, hiding it.");
        cartLeft.style.display = "none";
      } else {
        console.error("cartLeft not found!");
      }

      if (cartRight) {
        console.log("Found cartRight, hiding it.");
        cartRight.style.display = "none";
      } else {
        console.error("cartRight not found!");
      }

      if (cartSubtotalEl) cartSubtotalEl.textContent = "Rs 0";
      if (cartTotalEl) cartTotalEl.textContent = "Rs 0";
      if (updateCartBtn) updateCartBtn.disabled = true;
      return;
    }

    console.log("Cart has items. Showing cart content.");

    if (emptyCartEl) {
      console.log("Hiding emptyCartEl");
      emptyCartEl.style.display = "none";
    }

    if (cartLeft) {
      console.log("Showing cartLeft");
      cartLeft.style.display = "block";
    }

    if (cartRight) {
      console.log("Showing cartRight");
      cartRight.style.display = "block";
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = "";

    cart.forEach((item, idx) => {
      subtotal += item.price * item.quantity;

      const tr = document.createElement("tr");
      // FIXED: Added data-label attributes for mobile responsiveness
      tr.innerHTML = `
        <td data-label="Product">
          <div class="cart-product">
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name}</span>
          </div>
        </td>
        <td data-label="Price">Rs ${item.price}</td>
        <td data-label="Quantity">
          <div class="qty-wrapper">
            <button class="qty-btn minus" data-index="${idx}">-</button>
            <span class="qty-value" data-index="${idx}">${item.quantity}</span>
            <button class="qty-btn plus" data-index="${idx}">+</button>
          </div>
        </td>
        <td data-label="Subtotal">Rs ${item.price * item.quantity}</td>
        <td data-label="Remove">
          <button class="remove-item" data-index="${idx}">&times;</button>
        </td>
      `;
      cartItemsContainer.appendChild(tr);
    });

    // Calculate totals
    updateCartTotals(subtotal);

    // Setup event listeners for quantity buttons
    setupCartEventListeners();

    if (updateCartBtn) updateCartBtn.disabled = true;
  }

  function updateCartTotals(subtotal) {
    if (cartSubtotalEl) cartSubtotalEl.textContent = `Rs ${subtotal}`;

    let shippingCost = 0;
    const selectedShipping = document.querySelector(
      'input[name="ship"]:checked',
    );
    if (selectedShipping) {
      shippingCost = parseInt(selectedShipping.dataset.cost) || 0;
    }

    const total = subtotal + shippingCost;
    if (cartTotalEl) cartTotalEl.textContent = `Rs ${total}`;

    return { subtotal, shippingCost, total };
  }

  function setupCartEventListeners() {
    // Quantity buttons
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.index);
        if (btn.classList.contains("plus")) cart[idx].quantity++;
        if (btn.classList.contains("minus")) {
          cart[idx].quantity = Math.max(1, cart[idx].quantity - 1);
        }

        document.querySelector(`.qty-value[data-index="${idx}"]`).textContent =
          cart[idx].quantity;

        // Recalculate subtotal
        let subtotal = 0;
        cart.forEach((item) => {
          subtotal += item.price * item.quantity;
        });

        updateCartTotals(subtotal);

        if (updateCartBtn) updateCartBtn.disabled = false;

        // Update mini cart
        renderMiniCart();
      };
    });

    // Remove buttons
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.index);
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderMiniCart();
        renderCartPage();

        // If on checkout page, update it too
        if (typeof updateOrderSummary === "function") {
          updateOrderSummary();
        }
      };
    });
  }

  if (updateCartBtn) {
    updateCartBtn.addEventListener("click", () => {
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartPage();
      updateCartCount();
      updateCartBtn.disabled = true;
    });
  }

  if (shippingInputs.length > 0) {
    shippingInputs.forEach((input) => {
      input.addEventListener("change", () => {
        // Recalculate totals
        let subtotal = 0;
        cart.forEach((item) => {
          subtotal += item.price * item.quantity;
        });
        updateCartTotals(subtotal);

        // If on checkout page, update it too
        if (typeof updateOrderSummary === "function") {
          updateOrderSummary();
        }
      });
    });
  }

  /* ================= INTEGRATED CHECKOUT FUNCTIONALITY ================= */
  function initializeCheckoutPage() {
    // Only run if we're on the cart-checkout page
    const cartCheckoutContainer = document.querySelector(
      ".cart-checkout-container",
    );
    if (!cartCheckoutContainer) return;

    let currentStep = "cart";
    let checkoutData = {
      cart: JSON.parse(localStorage.getItem("cart")) || [],
      customerInfo: {},
      shippingCost: 0,
      paymentMethod: "cod",
    };

    // Navigation functions
    function showStep(step) {
      // Hide all steps
      const cartStep = document.getElementById("cartStep");
      const infoStep = document.getElementById("infoStep");
      const paymentStep = document.getElementById("paymentStep");
      const progressBar = document.querySelector(".checkout-progress");

      if (cartStep) cartStep.style.display = "none";
      if (infoStep) infoStep.style.display = "none";
      if (paymentStep) paymentStep.style.display = "none";
      if (progressBar) progressBar.style.display = "none";

      // Show requested step
      if (step === "cart") {
        if (cartStep) {
          cartStep.style.display = "flex";
          renderCartPage();
        }
        currentStep = "cart";
      } else if (step === "info") {
        if (infoStep) {
          infoStep.style.display = "block";
          if (progressBar) progressBar.style.display = "block";
          updateProgressBar(2);
          updateOrderSummary();
        }
        currentStep = "info";
      } else if (step === "payment") {
        if (paymentStep) {
          paymentStep.style.display = "block";
          if (progressBar) progressBar.style.display = "block";
          updateProgressBar(3);
          updatePaymentSummary();
        }
        currentStep = "payment";
      }
    }

    function updateProgressBar(step) {
      document.querySelectorAll(".step").forEach((s) => {
        s.classList.remove("active");
        if (parseInt(s.dataset.step) <= step) {
          s.classList.add("active");
        }
      });
    }

    function updateOrderSummary() {
      const cart = checkoutData.cart;
      let subtotal = 0;

      // Update order items preview
      const orderItemsPreview = document.getElementById("orderItemsPreview");
      if (!orderItemsPreview) return;

      orderItemsPreview.innerHTML = "";

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemDiv = document.createElement("div");
        itemDiv.className = "order-item";
        itemDiv.innerHTML = `
          <span class="order-item-name">${item.name} × ${item.quantity}</span>
          <span class="order-item-price">Rs ${itemTotal.toLocaleString()}</span>
        `;
        orderItemsPreview.appendChild(itemDiv);
      });

      // Calculate shipping
      const selectedShipping = document.querySelector(
        'input[name="ship"]:checked',
      );
      const shippingCost = selectedShipping
        ? parseInt(selectedShipping.dataset.cost)
        : 0;
      checkoutData.shippingCost = shippingCost;

      const total = subtotal + shippingCost;

      // Update totals
      const orderSubtotal = document.getElementById("orderSubtotal");
      const orderShipping = document.getElementById("orderShipping");
      const orderTotal = document.getElementById("orderTotal");

      if (orderSubtotal)
        orderSubtotal.textContent = `Rs ${subtotal.toLocaleString()}`;
      if (orderShipping) orderShipping.textContent = `Rs ${shippingCost}`;
      if (orderTotal) orderTotal.textContent = `Rs ${total.toLocaleString()}`;
    }

    function updatePaymentSummary() {
      // Update customer info preview
      const customerInfoPreview = document.getElementById(
        "customerInfoPreview",
      );
      if (customerInfoPreview) {
        const { firstName, lastName, address, city, province, phone, email } =
          checkoutData.customerInfo;
        const customerInfo = `
          <p><strong>${firstName} ${lastName}</strong></p>
          <p>${address}</p>
          <p>${city}, ${province}</p>
          <p>Phone: ${phone}</p>
          <p>Email: ${email}</p>
        `;
        customerInfoPreview.innerHTML = customerInfo;
      }

      // Update order items
      const paymentItemsPreview = document.getElementById(
        "paymentItemsPreview",
      );
      if (paymentItemsPreview) {
        paymentItemsPreview.innerHTML = "";

        let subtotal = 0;
        checkoutData.cart.forEach((item) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          const itemDiv = document.createElement("div");
          itemDiv.className = "order-item";
          itemDiv.innerHTML = `
            <span class="order-item-name">${item.name} × ${item.quantity}</span>
            <span class="order-item-price">Rs ${itemTotal.toLocaleString()}</span>
          `;
          paymentItemsPreview.appendChild(itemDiv);
        });

        const total = subtotal + checkoutData.shippingCost;

        // Update payment totals
        const paymentSubtotal = document.getElementById("paymentSubtotal");
        const paymentShipping = document.getElementById("paymentShipping");
        const paymentTotal = document.getElementById("paymentTotal");

        if (paymentSubtotal)
          paymentSubtotal.textContent = `Rs ${subtotal.toLocaleString()}`;
        if (paymentShipping)
          paymentShipping.textContent = `Rs ${checkoutData.shippingCost}`;
        if (paymentTotal)
          paymentTotal.textContent = `Rs ${total.toLocaleString()}`;
      }
    }

    // Setup event listeners for checkout
    function setupCheckoutEventListeners() {
      // Start checkout
      const startCheckoutBtn = document.getElementById("startCheckoutBtn");
      if (startCheckoutBtn) {
        startCheckoutBtn.addEventListener("click", function () {
          if (checkoutData.cart.length === 0) {
            alert("Your cart is empty. Please add items to your cart first.");
            return;
          }
          showStep("info");
        });
      }

      // Mini cart checkout
      const miniCheckoutBtn = document.getElementById("miniCheckoutBtn");
      if (miniCheckoutBtn) {
        miniCheckoutBtn.addEventListener("click", function (e) {
          e.preventDefault();
          if (checkoutData.cart.length > 0) {
            showStep("info");
          } else {
            alert("Your cart is empty. Please add items to your cart first.");
          }
        });
      }

      // Back to cart
      const backToCartBtn = document.getElementById("backToCartBtn");
      if (backToCartBtn) {
        backToCartBtn.addEventListener("click", function () {
          showStep("cart");
        });
      }

      // Proceed to payment
      const proceedToPaymentBtn = document.getElementById(
        "proceedToPaymentBtn",
      );
      if (proceedToPaymentBtn) {
        proceedToPaymentBtn.addEventListener("click", function () {
          const form = document.getElementById("infoForm");
          if (!form) return;

          if (!form.checkValidity()) {
            alert("Please fill in all required fields correctly.");
            form.reportValidity();
            return;
          }

          // Save customer info
          checkoutData.customerInfo = {
            firstName: document.getElementById("firstName")?.value || "",
            lastName: document.getElementById("lastName")?.value || "",
            email: document.getElementById("email")?.value || "",
            phone: document.getElementById("phone")?.value || "",
            address: document.getElementById("address")?.value || "",
            city: document.getElementById("city")?.value || "",
            province: document.getElementById("province")?.value || "",
            postcode: document.getElementById("postcode")?.value || "",
          };

          showStep("payment");
        });
      }

      // Back to info
      const backToInfoBtn = document.getElementById("backToInfoBtn");
      if (backToInfoBtn) {
        backToInfoBtn.addEventListener("click", function () {
          showStep("info");
        });
      }

      // Place order
      const placeOrderBtn = document.getElementById("placeOrderBtn");
      if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", function () {
          const terms = document.getElementById("terms");
          if (!terms || !terms.checked) {
            alert("Please agree to the terms and conditions.");
            return;
          }

          // Get payment method
          const selectedPayment = document.querySelector(
            'input[name="payment"]:checked',
          );
          checkoutData.paymentMethod = selectedPayment
            ? selectedPayment.value
            : "cod";

          // Validate card payment if selected
          if (checkoutData.paymentMethod === "card") {
            const cardNumber = document
              .getElementById("cardNumber")
              ?.value.trim();
            const expiryDate = document
              .getElementById("expiryDate")
              ?.value.trim();
            const cvv = document.getElementById("cvv")?.value.trim();
            const cardName = document.getElementById("cardName")?.value.trim();

            if (!cardNumber || !expiryDate || !cvv || !cardName) {
              alert("Please fill in all card payment details.");
              return;
            }

            // Basic card validation
            if (cardNumber.replace(/\s/g, "").length < 16) {
              alert("Please enter a valid 16-digit card number.");
              return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
              alert("Please enter expiry date in MM/YY format.");
              return;
            }

            if (cvv.length < 3) {
              alert("Please enter a valid CVV (3-4 digits).");
              return;
            }
          }

          // Show loading
          this.textContent = "Processing...";
          this.disabled = true;

          // Generate order ID
          const orderId = `#ORD-${new Date().getFullYear()}-${Math.floor(
            Math.random() * 10000,
          )
            .toString()
            .padStart(5, "0")}`;

          setTimeout(() => {
            // Clear cart
            localStorage.removeItem("cart");
            checkoutData.cart = [];
            cart = []; // Update global cart variable

            // Show confirmation
            const confirmationModal =
              document.getElementById("confirmationModal");
            const generatedOrderId =
              document.getElementById("generatedOrderId");
            if (confirmationModal) confirmationModal.classList.add("active");
            if (generatedOrderId) generatedOrderId.textContent = orderId;
            document.body.style.overflow = "hidden";

            // Update cart count
            updateCartCount();

            // Reset button
            this.textContent = "Place Order";
            this.disabled = false;
          }, 1500);
        });
      }

      // Continue shopping
      const continueShoppingBtn = document.getElementById(
        "continueShoppingBtn",
      );
      if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener("click", function () {
          const confirmationModal =
            document.getElementById("confirmationModal");
          if (confirmationModal) confirmationModal.classList.remove("active");
          document.body.style.overflow = "";
          window.location.href = "index.html";
        });
      }

      // Close modal on overlay click
      const confirmationOverlay = document.querySelector(
        ".confirmation-overlay",
      );
      if (confirmationOverlay) {
        confirmationOverlay.addEventListener("click", function () {
          const confirmationModal =
            document.getElementById("confirmationModal");
          if (confirmationModal) confirmationModal.classList.remove("active");
          document.body.style.overflow = "";
        });
      }

      // Shipping cost changes
      const shippingRadios = document.querySelectorAll('input[name="ship"]');
      shippingRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
          updateOrderSummary();
          renderCartPage();
        });
      });
    }

    // Initialize checkout
    updateCartCount();
    renderCartPage();
    setupCheckoutEventListeners();

    // Sync checkoutData cart with global cart
    checkoutData.cart = cart;

    // Make updateOrderSummary available globally for other functions
    window.updateOrderSummary = updateOrderSummary;

    // Initialize payment method toggles
    initializePaymentMethodToggles();
  }

  /* ================= PAYMENT METHOD TOGGLES ================= */
  function initializePaymentMethodToggles() {
    // Handle payment method changes
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const cardPaymentForm = document.getElementById("cardPaymentForm");
    const bankTransferDetails = document.getElementById("bankTransferDetails");

    if (paymentMethods.length > 0) {
      paymentMethods.forEach((method) => {
        method.addEventListener("change", function () {
          // Hide all payment details
          if (cardPaymentForm) cardPaymentForm.style.display = "none";
          if (bankTransferDetails) bankTransferDetails.style.display = "none";

          // Show selected payment details
          if (this.value === "card" && cardPaymentForm) {
            cardPaymentForm.style.display = "block";
          } else if (this.value === "banktransfer" && bankTransferDetails) {
            bankTransferDetails.style.display = "block";
          }
        });
      });
    }

    // Format card number input
    const cardNumberInput = document.getElementById("cardNumber");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        let formatted = value.replace(/(\d{4})/g, "$1 ").trim();
        e.target.value = formatted.substring(0, 19);
      });
    }

    // Format expiry date input
    const expiryDateInput = document.getElementById("expiryDate");
    if (expiryDateInput) {
      expiryDateInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length >= 2) {
          value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
      });
    }

    // Format CVV input
    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
      cvvInput.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "").substring(0, 4);
      });
    }
  }

  /* ================= REVIEW FUNCTIONALITY ================= */
  // Store reviews in localStorage
  if (!localStorage.getItem("productReviews")) {
    localStorage.setItem("productReviews", JSON.stringify({}));
  }

  // Function to save a review
  window.saveReview = function (productId, reviewData) {
    const allReviews = JSON.parse(localStorage.getItem("productReviews")) || {};
    if (!allReviews[productId]) {
      allReviews[productId] = [];
    }

    // Add the new review
    allReviews[productId].push({
      id: Date.now(),
      ...reviewData,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    });

    // Save back to localStorage
    localStorage.setItem("productReviews", JSON.stringify(allReviews));

    // Update review count
    const reviewTabBtn = document.getElementById("reviewTabBtn");
    if (reviewTabBtn) {
      reviewTabBtn.textContent = `REVIEWS (${allReviews[productId].length})`;
    }

    // Show success message
    alert("Thank you for your review! It has been submitted successfully.");

    // Reload reviews
    loadReviews(productId);

    // Clear the form
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
      reviewForm.reset();
      // Reset star rating
      const stars = document.querySelectorAll(".star-rating .star");
      stars.forEach((star) => {
        star.classList.remove("selected");
        star.innerHTML = "☆";
      });
      // Reset hidden input
      const ratingInput = document.getElementById("reviewRating");
      if (ratingInput) ratingInput.value = "0";
    }
  };

  // Function to load reviews
  window.loadReviews = function (productId) {
    const allReviews = JSON.parse(localStorage.getItem("productReviews")) || {};
    const productReviews = allReviews[productId] || [];

    // Create reviews HTML
    let reviewsHTML = "";

    if (productReviews.length === 0) {
      reviewsHTML = `
        <div class="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      `;
    } else {
      reviewsHTML = `
        <div class="reviews-list">
          <h4>Customer Reviews (${productReviews.length})</h4>
          ${productReviews
            .map(
              (review) => `
            <div class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <strong>${review.name}</strong>
                  <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                  ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
                  <span class="rating-text">${review.rating}.0 out of 5</span>
                </div>
              </div>
              <div class="review-title">
                <strong>${review.title}</strong>
              </div>
              <div class="review-content">
                <p>${review.comment}</p>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }

    // Add review form
    reviewsHTML += `
      <div class="add-review">
        <h4>Write a Review</h4>
        <form id="reviewForm" onsubmit="return submitReview('${productId}')">
          <div class="form-group">
            <label for="reviewName">Your Name <span class="asterik">*</span></label>
            <input type="text" id="reviewName" required>
          </div>
          
          <div class="form-group">
            <label for="reviewEmail">Email Address <span class="asterik">*</span></label>
            <input type="email" id="reviewEmail" required>
          </div>
          
          <div class="form-group">
            <label>Your Rating <span class="asterik">*</span></label>
            <div class="star-rating">
              <span class="star" data-value="1">☆</span>
              <span class="star" data-value="2">☆</span>
              <span class="star" data-value="3">☆</span>
              <span class="star" data-value="4">☆</span>
              <span class="star" data-value="5">☆</span>
              <input type="hidden" id="reviewRating" value="0" required>
            </div>
            <div class="rating-labels">
              <span>Poor</span>
              <span>Average</span>
              <span>Good</span>
              <span>Very Good</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="reviewTitle">Review Title <span class="asterik">*</span></label>
            <input type="text" id="reviewTitle" placeholder="Summarize your review" required>
          </div>
          
          <div class="form-group">
            <label for="reviewComment">Your Review <span class="asterik">*</span></label>
            <textarea id="reviewComment" rows="5" placeholder="Share your experience with this product" required></textarea>
          </div>

          <div class="form-group terms">
            <input type="checkbox" id="reviewTerms" required>
            <label for="reviewTerms">I accept the <a href="#">terms and conditions</a> and agree to the <a href="#">privacy policy</a><span class="asterik"> *</span></label>
          </div>

          <button type="submit" class="submit-review-btn">Submit Review</button>
        </form>
      </div>
    `;

    // Update tab content
    const tabContent = document.getElementById("tabContent");
    if (tabContent) {
      tabContent.innerHTML = reviewsHTML;

      // Initialize star rating
      const stars = document.querySelectorAll(".star-rating .star");
      stars.forEach((star) => {
        star.addEventListener("click", function () {
          const value = parseInt(this.getAttribute("data-value"));
          const ratingInput = document.getElementById("reviewRating");
          ratingInput.value = value;

          // Update stars display
          stars.forEach((s, index) => {
            if (index < value) {
              s.innerHTML = "★";
              s.classList.add("selected");
            } else {
              s.innerHTML = "☆";
              s.classList.remove("selected");
            }
          });
        });

        // Add hover effect
        star.addEventListener("mouseover", function () {
          const value = parseInt(this.getAttribute("data-value"));
          stars.forEach((s, index) => {
            if (index < value) {
              s.style.color = "#ffd700";
            }
          });
        });

        star.addEventListener("mouseout", function () {
          stars.forEach((s) => {
            s.style.color = "";
          });
        });
      });
    }
  };

  // Function to submit review
  window.submitReview = function (productId) {
    const name = document.getElementById("reviewName")?.value.trim();
    const email = document.getElementById("reviewEmail")?.value.trim();
    const rating = parseInt(
      document.getElementById("reviewRating")?.value || "0",
    );
    const title = document.getElementById("reviewTitle")?.value.trim();
    const comment = document.getElementById("reviewComment")?.value.trim();
    const terms = document.getElementById("reviewTerms")?.checked;

    // Validation
    if (!name || !email || !rating || !title || !comment || !terms) {
      alert("Please fill in all required fields and accept the terms.");
      return false;
    }

    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Save the review
    const reviewData = {
      name: name,
      email: email,
      rating: rating,
      title: title,
      comment: comment,
    };

    saveReview(productId, reviewData);
    return false; // Prevent form submission
  };

  /* ================= PRODUCT DETAIL PAGE ================= */
  function initializeProductDetailPage() {
    const mainImg = document.getElementById("mainImage");
    if (!mainImg) return; // Not on product detail page

    // Get the product ID from localStorage
    const productId = localStorage.getItem("selectedProductId");

    if (!productId) {
      console.error("No product ID found in localStorage");
      return;
    }

    // Try to find product by ID (could be number or string)
    let product;

    // First try as number
    if (!isNaN(productId)) {
      product = products.find((p) => p.id === parseInt(productId));
    }

    // If not found, try as string (name-based ID from homepage)
    if (!product) {
      // Convert string ID back to product name format
      const productName = productId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      product = products.find((p) => p.name === productName);

      // If still not found, try partial match
      if (!product) {
        product = products.find(
          (p) =>
            p.name.toLowerCase().includes(productId.toLowerCase()) ||
            p.id.toString() === productId,
        );
      }
    }

    // If product is still not found, use a default
    if (!product) {
      console.warn("Product not found, using default");
      product = {
        id: 1,
        name: "Product Not Found",
        price: 0,
        img: "img/cnc.webp",
        description: "This product information could not be loaded.",
        categories: ["Unknown"],
        gallery: ["img/cnc.webp"],
        notes: ["Product details unavailable"],
      };
    }

    // Update the page with product data
    const productTitle = document.getElementById("productTitle");
    const currentPrice = document.getElementById("currentPrice");
    const oldPrice = document.getElementById("oldPrice");

    if (productTitle) productTitle.textContent = product.name;
    if (currentPrice) currentPrice.textContent = `Rs ${product.price}`;
    if (oldPrice) oldPrice.textContent = `Rs ${product.price + 800}`;
    if (mainImg) mainImg.src = product.img;

    // Gallery
    const thumbs = document.getElementById("galleryThumbs");
    if (thumbs) {
      thumbs.innerHTML = "";
      product.gallery.forEach((img) => {
        const t = document.createElement("img");
        t.src = img;
        t.onclick = () => (mainImg.src = img);
        thumbs.appendChild(t);
      });
    }

    // Quantity functionality
    let qty = 1;
    const qtyVal = document.querySelector(".qty-value");
    if (qtyVal) {
      qtyVal.textContent = qty;
      document
        .querySelector(".qty-btn.minus")
        ?.addEventListener("click", () => {
          qty = Math.max(1, qty - 1);
          qtyVal.textContent = qty;
        });
      document.querySelector(".qty-btn.plus")?.addEventListener("click", () => {
        qty++;
        qtyVal.textContent = qty;
      });
    }

    // Add to cart button with visual feedback
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        addToCart(product.id, qty);

        // Show feedback - consistent with other pages
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = "Added to Cart!";
        addToCartBtn.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
          addToCartBtn.textContent = originalText;
          addToCartBtn.style.backgroundColor = "";
        }, 1000);
      });
    }

    // Product notes
    const notesEl = document.getElementById("productNotes");
    if (notesEl) {
      notesEl.innerHTML = "";
      product.notes.forEach((n) => (notesEl.innerHTML += `<li>${n}</li>`));
    }

    // Product categories
    const catEl = document.getElementById("productCategories");
    if (catEl)
      catEl.textContent = "Categories: " + product.categories.join(", ");

    // Tabs functionality - UPDATED FOR REVIEWS
    const tabContent = document.getElementById("tabContent");
    const descTabBtn = document.getElementById("descTabBtn");
    const reviewTabBtn = document.getElementById("reviewTabBtn");

    if (descTabBtn && reviewTabBtn && tabContent) {
      descTabBtn.addEventListener("click", () => {
        descTabBtn.classList.add("active");
        reviewTabBtn.classList.remove("active");
        tabContent.innerHTML = `<h3>Description of ${product.name}</h3><p>${product.description}</p>`;
      });

      reviewTabBtn.addEventListener("click", () => {
        reviewTabBtn.classList.add("active");
        descTabBtn.classList.remove("active");
        loadReviews(product.id);

        // Update review count on the tab button
        const allReviews =
          JSON.parse(localStorage.getItem("productReviews")) || {};
        const productReviews = allReviews[product.id] || [];
        reviewTabBtn.textContent = `REVIEWS (${productReviews.length})`;
      });

      // Initialize description tab
      descTabBtn.click();
    }

    // Load review count initially
    const allReviews = JSON.parse(localStorage.getItem("productReviews")) || {};
    const productReviews = allReviews[product.id] || [];
    if (reviewTabBtn) {
      reviewTabBtn.textContent = `REVIEWS (${productReviews.length})`;
    }
  }

  /* ================= SORT ================= */
  sortSelect?.addEventListener("change", () => {
    let sorted = [...products];
    if (sortSelect.value === "price-low")
      sorted.sort((a, b) => a.price - b.price);
    if (sortSelect.value === "price-high")
      sorted.sort((a, b) => b.price - a.price);
    if (sortSelect.value === "name-asc")
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sortSelect.value === "name-desc")
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    currentPage = 1;
    renderProducts(sorted, currentPage);
  });

  /* ================= BACK TO TOP ================= */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (backToTop)
        backToTop.style.display = window.scrollY > 300 ? "flex" : "none";
    });
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  /* ================= LOGIN / REGISTER MODAL ================= */
  const authModal = document.getElementById("authModal");
  document.querySelectorAll('.account a[href="#"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (authModal) authModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeAuthBtn = document.getElementById("closeAuth");
  if (closeAuthBtn) {
    closeAuthBtn.addEventListener("click", () => {
      if (authModal) authModal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  const authOverlay = document.querySelector(".auth-overlay");
  if (authOverlay) {
    authOverlay.addEventListener("click", () => {
      if (authModal) authModal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  /* ================= ADD CSS FOR REVIEWS ================= */
  function addReviewStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Reviews Styling */
      .no-reviews {
        text-align: center;
        padding: 40px 20px;
        background: #f9f9f9;
        border-radius: 8px;
        margin-bottom: 30px;
      }
      
      .no-reviews p {
        font-size: 16px;
        color: #666;
      }
      
      .reviews-list {
        margin-bottom: 40px;
      }
      
      .reviews-list h4 {
        font-size: 20px;
        color: #333;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #eee;
      }
      
      .review-item {
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 20px;
        background: #fff;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }
      
      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }
      
      .reviewer-info {
        flex: 1;
      }
      
      .reviewer-info strong {
        display: block;
        font-size: 16px;
        color: #333;
      }
      
      .review-date {
        font-size: 14px;
        color: #888;
        margin-top: 2px;
      }
      
      .review-rating {
        color: #ffd700;
        font-size: 18px;
      }
      
      .rating-text {
        font-size: 14px;
        color: #666;
        margin-left: 10px;
      }
      
      .review-title {
        font-size: 16px;
        color: #333;
        margin-bottom: 10px;
      }
      
      .review-content {
        color: #555;
        line-height: 1.6;
        font-size: 14px;
      }
      
      /* Add Review Form */
      .add-review {
        padding: 25px;
        background: #f9f9f9;
        border-radius: 8px;
        border: 1px solid #eee;
      }
      
      .add-review h4 {
        font-size: 20px;
        color: #333;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #eee;
      }
      
      .add-review .form-group {
        margin-bottom: 20px;
      }

      .asterik {
        color: red;
      }
      
      .add-review label {
        display: block;
        font-size: 14px;
        color: #555;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .add-review input[type="text"],
      .add-review input[type="email"],
      .add-review textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s ease;
      }
      
      .add-review input[type="text"]:focus,
      .add-review input[type="email"]:focus,
      .add-review textarea:focus {
        outline: none;
        border-color: #4338ca;
      }
      
      /* Star Rating */
      .star-rating {
        display: flex;
        gap: 5px;
        margin-bottom: 5px;
      }
      
      .star-rating .star {
        font-size: 28px;
        color: #ccc;
        cursor: pointer;
        transition: color 0.2s ease;
      }
      
      .star-rating .star.selected {
        color: #ffd700;
      }
      
      .star-rating .star:hover {
        color: #ffd700;
      }
      
      .rating-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #888;
        margin-top: 5px;
      }
      
      /* Terms Checkbox */
      .add-review .terms {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-bottom: 20px;
      }

      .add-review .terms input[type="checkbox"] {
        margin-top: 3px;
        margin-right: 5px;
        accent-color: #4338ca;
        flex-shrink: 0;
        cursor: pointer;
      }

      .add-review .terms label {
        margin: 0;
        font-size: 13px;
        color: #555;
        line-height: 1.4;
        text-align: left;
      }
      
      .add-review .terms input[type="checkbox"] {
        margin: 0;
        accent-color: #4338ca;
      }
      
      .add-review .terms label {
        margin: 0;
        font-size: 13px;
        color: #555;
      }
      
      .add-review .terms a {
        color: #4338ca;
        text-decoration: none;
      }
      
      .add-review .terms a:hover {
        text-decoration: underline;
      }
      
      /* Submit Button */
      .submit-review-btn {
        background: #4338ca;
        color: white;
        border: none;
        padding: 14px 30px;
        font-size: 16px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
        font-weight: 600;
      }
      
      .submit-review-btn:hover {
        background: #3729a8;
      }
      
      @media (max-width: 768px) {
        .review-header {
          flex-direction: column;
          gap: 10px;
        }
        
        .review-rating {
          width: 100%;
        }
        
        .add-review {
          padding: 15px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ================= INITIALIZE ================= */
  renderProducts(products, currentPage);
  renderMiniCart();
  renderCartPage();
  updateCartCount();

  // Initialize homepage interactivity
  initializeHomepageProducts();
  initializeNewArrivalSlider();

  // Initialize product detail page if we're on that page
  initializeProductDetailPage();

  // Initialize checkout page if we're on that page
  initializeCheckoutPage();

  // Add review styles
  addReviewStyles();
});
