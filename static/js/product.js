// document.addEventListener("DOMContentLoaded", () => {

//   /* ================= CART LOGIC & ALL PRODUCTS PAGE ================= */
  
//   const grid = document.getElementById("productsGrid");
//   const pagination = document.getElementById("pagination");
//   const sortBy = document.getElementById("sortBy");

//   // CART PAGE ELEMENTS
//   const cartItemsContainer = document.getElementById("cart-items");
//   const emptyCart = document.getElementById("empty-cart");
//   const cartTotalEl = document.getElementById("cart-total");
//   const cartSubtotalEl = document.getElementById("cart-subtotal");

//   // HEADER CART COUNT
//   function updateCartCount() {
//     let cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const count = cart.reduce((acc, item) => acc + item.quantity || item.qty, 0);
//     document.querySelector(".cart-count")?.textContent = count;
//   }

//   /* ===== PRODUCTS DATA ===== */
//   if (grid && pagination && sortBy) {
//     const productNames = [
//       "Arduino Uno", "Arduino Mega", "ESP32 Dev Board", "ESP8266 NodeMCU",
//       "CNC Shield", "Stepper Motor", "Servo Motor", "Laser Module 5W",
//       "Laser Module 10W", "3D Printer Nozzle", "Ender 3 Hotend",
//       "PLA Filament", "ABS Filament", "Raspberry Pi 4", "Raspberry Pi Pico",
//       "Relay Module", "Power Supply 12V", "Power Supply 24V", "Linear Rail",
//       "Timing Belt GT2", "Lead Screw", "Motor Driver A4988",
//       "Motor Driver DRV8825", "OLED Display", "LCD 16x2", "Touch Screen",
//       "Proximity Sensor", "IR Sensor", "Ultrasonic Sensor", "Camera Module",
//       "CNC Spindle", "Cooling Fan"
//     ];

//     const productImage = (text) => `
//       data:image/svg+xml;utf8,
//       <svg xmlns='http://www.w3.org/2000/svg' width='300' height='220'>
//         <rect width='100%' height='100%' fill='%23f4f4f4'/>
//         <text x='50%' y='50%' font-size='16' fill='%23999'
//           text-anchor='middle' dominant-baseline='middle'>
//           ${text}
//         </text>
//       </svg>
//     `;

//     const products = [];
//     for (let i = 0; i < 48; i++) {
//       const name = productNames[i % productNames.length];
//       products.push({
//         id: i + 1,
//         name: `${name} ${i + 1}`,
//         price: Math.floor(Math.random() * 8000) + 800,
//         image: productImage(name)
//       });
//     }

//     const productsPerPage = 32;
//     let currentPage = 1;
//     let currentProducts = [...products];

//     function renderProducts() {
//       grid.innerHTML = "";
//       const start = (currentPage - 1) * productsPerPage;
//       const end = start + productsPerPage;

//       currentProducts.slice(start, end).forEach(p => {
//         grid.innerHTML += `
//           <div class="product-card">
//             <ion-icon name="heart-circle-outline" class="wishlist-btn"></ion-icon>
//             <img src="${p.image}" alt="${p.name}">
//             <h3>${p.name}</h3>
//             <p class="price">Rs ${p.price}</p>
//             <button 
//               class="add-cart"
//               data-id="${p.id}"
//               data-name="${p.name}"
//               data-price="${p.price}"
//               data-image="${p.image}"
//             >Add to Cart</button>
//           </div>
//         `;
//       });

//       attachProductEvents();
//       renderPagination();
//     }

//     function attachProductEvents() {
//       document.querySelectorAll(".wishlist-btn").forEach(btn => {
//         btn.onclick = () => btn.classList.toggle("active");
//       });

//       document.querySelectorAll(".add-cart").forEach(btn => {
//         btn.onclick = () => addToCart(btn);
//       });
//     }

//     function addToCart(btn) {
//       const product = {
//         id: btn.dataset.id,
//         name: btn.dataset.name,
//         price: Number(btn.dataset.price),
//         image: btn.dataset.image,
//         quantity: 1
//       };

//       let cart = JSON.parse(localStorage.getItem("cart") || "[]");

//       const existing = cart.find(item => item.id == product.id);
//       if (existing) {
//         existing.quantity += 1;
//       } else {
//         cart.push(product);
//       }

//       localStorage.setItem("cart", JSON.stringify(cart));
//       updateCartCount();
//       alert("Product added to cart 🛒");

//       // Update cart page if it's open
//       if (cartItemsContainer) renderCart();
//     }

//     function renderPagination() {
//       pagination.innerHTML = "";
//       const totalPages = Math.ceil(currentProducts.length / productsPerPage);
//       for (let i = 1; i <= totalPages; i++) {
//         pagination.innerHTML += `
//           <button class="${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>
//         `;
//       }
//       pagination.querySelectorAll("button").forEach(btn => {
//         btn.onclick = () => {
//           currentPage = Number(btn.dataset.page);
//           renderProducts();
//         };
//       });
//     }

//     sortBy.addEventListener("change", () => {
//       const v = sortBy.value;
//       if (v === "price-low") currentProducts.sort((a,b) => a.price - b.price);
//       if (v === "price-high") currentProducts.sort((a,b) => b.price - a.price);
//       if (v === "name-asc") currentProducts.sort((a,b) => a.name.localeCompare(b.name));
//       if (v === "name-desc") currentProducts.sort((a,b) => b.name.localeCompare(a.name));
//       currentPage = 1;
//       renderProducts();
//     });

//     renderProducts();
//   }

//   /* ================= CART PAGE ================= */
//   function renderCart() {
//     let cart = JSON.parse(localStorage.getItem("cart") || "[]");

//     if (!cartItemsContainer || !emptyCart) return;

//     if (cart.length === 0) {
//       emptyCart.style.display = "block";
//       cartItemsContainer.innerHTML = "";
//       cartSubtotalEl.textContent = "0 Rs";
//       cartTotalEl.textContent = "0 Rs";
//       return;
//     }

//     emptyCart.style.display = "none";
//     cartItemsContainer.innerHTML = "";
//     let subtotal = 0;

//     cart.forEach((item, index) => {
//       const itemSubtotal = item.price * item.quantity;
//       subtotal += itemSubtotal;

//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>
//           <div class="cart-product">
//             <img src="${item.image}" width="60">
//             <span>${item.name}</span>
//           </div>
//         </td>
//         <td>${item.price} Rs</td>
//         <td>
//           <div class="cart-qty">
//             <button class="qty-minus">-</button>
//             <input type="text" value="${item.quantity}" readonly>
//             <button class="qty-plus">+</button>
//           </div>
//         </td>
//         <td>${itemSubtotal} Rs</td>
//         <td><button class="remove-item">×</button></td>
//       `;

//       cartItemsContainer.appendChild(row);

//       row.querySelector(".qty-minus").addEventListener("click", () => updateQty(index, -1));
//       row.querySelector(".qty-plus").addEventListener("click", () => updateQty(index, 1));
//       row.querySelector(".remove-item").addEventListener("click", () => removeItem(index));
//     });

//     cartSubtotalEl.textContent = `${subtotal} Rs`;

//     const shippingInputs = document.querySelectorAll("input[name='ship']");
//     let shippingCost = 0;
//     shippingInputs.forEach(input => {
//       if (input.checked) shippingCost = Number(input.value);
//       input.addEventListener("change", renderCart);
//     });

//     cartTotalEl.textContent = `${subtotal + shippingCost} Rs`;
//     updateCartCount();
//   }

//   function updateQty(index, change) {
//     let cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     cart[index].quantity += change;
//     if (cart[index].quantity <= 0) cart.splice(index, 1);
//     localStorage.setItem("cart", JSON.stringify(cart));
//     renderCart();
//   }

//   function removeItem(index) {
//     let cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     cart.splice(index, 1);
//     localStorage.setItem("cart", JSON.stringify(cart));
//     renderCart();
//   }

//   // Initial cart render
//   if (cartItemsContainer) renderCart();
//   updateCartCount();

// });
