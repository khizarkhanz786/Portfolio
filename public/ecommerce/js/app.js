// State Management
let products = [];
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const categoryBtns = document.querySelectorAll('.cat-btn');
const searchInput = document.getElementById('product-search');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchCart(); // Fetch existing cart from backend
    setupEventListeners();
});

// Fetch All Products
async function fetchProducts() {
    try {
        productsGrid.innerHTML = '<div class="loader-spinner"><i class="fas fa-spinner fa-spin"></i> Loading Products...</div>';

        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');

        products = await res.json();
        renderProducts(products);
    } catch (err) {
        console.error("Fetch Products Error:", err);
        productsGrid.innerHTML = '<p class="error">Error loading products. Please try again later.</p>';
    }
}

// Fetch Cart from Backend
async function fetchCart() {
    try {
        const res = await fetch('/api/cart');
        if (res.ok) {
            cart = await res.json();
            updateCartUI();
        }
    } catch (err) {
        console.error("Fetch Cart Error:", err);
    }
}

// Render Product Cards
function renderProducts(items) {
    productsGrid.innerHTML = '';

    if (items.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No products match your search.</p>';
        return;
    }

    items.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="prod-img-wrap">
                <img src="${product.image}" alt="${product.name}" class="prod-img" loading="lazy">
            </div>
            <div class="prod-info">
                <span class="prod-category">${product.category}</span>
                <h3 class="prod-title">${product.name}</h3>
                <p class="prod-desc">${product.description || ''}</p>
                <div class="prod-footer">
                    <span class="prod-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(card);

        // GSAP Animation
        gsap.from(card, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });

        // Add to Cart Event
        card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            addToCart(product);
        });
    });
}

// Cart Logic
async function addToCart(product) {
    try {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (res.ok) {
            cart = await res.json();
            updateCartUI();
            toggleCart(true);
            showToast(`Added ${product.name} to cart`);
        }
    } catch (err) {
        console.error("Add to Cart Error:", err);
        showToast("Failed to add to cart", "error");
    }
}

async function removeFromCart(id) {
    try {
        const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
        if (res.ok) {
            cart = await res.json();
            updateCartUI();
        }
    } catch (err) {
        console.error("Remove from Cart Error:", err);
    }
}

async function updateQty(id, qty) {
    if (qty <= 0) return removeFromCart(id);

    try {
        const res = await fetch(`/api/cart/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qty })
        });
        if (res.ok) {
            cart = await res.json();
            updateCartUI();
        }
    } catch (err) {
        console.error("Update Qty Error:", err);
    }
}

function updateCartUI() {
    // Badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    // List
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
    } else {
        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button onclick="updateQty('${item.id}', ${item.qty - 1})">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });
    }

    // Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Global functions for inline onclick (alternative: addEventListeners in loop)
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;

// Sidebar Toggle
function toggleCart(isOpen) {
    if (isOpen) {
        document.body.classList.add('cart-open');
    } else {
        document.body.classList.remove('cart-open');
    }
}

// Event Listeners
function setupEventListeners() {
    cartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    // Filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.cat;
            filterAndSearch(category, searchInput.value);
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        const activeCat = document.querySelector('.cat-btn.active').dataset.cat;
        filterAndSearch(activeCat, e.target.value);
    });

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) return showToast("Cart is empty");
        alert("Thank you for your purchase! (Simulation)");
        // Clear cart logic could go here
    });
}

function filterAndSearch(category, query) {
    let filtered = products;

    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    if (query) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }

    renderProducts(filtered);
}

// Toast
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
