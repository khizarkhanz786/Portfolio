const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CART_FILE = path.join(__dirname, '../cart.json');

const readCart = () => {
    try {
        if (!fs.existsSync(CART_FILE)) return [];
        return JSON.parse(fs.readFileSync(CART_FILE));
    } catch (err) {
        return [];
    }
};

const saveCart = (cart) => {
    try {
        fs.writeFileSync(CART_FILE, JSON.stringify(cart, null, 2));
    } catch (err) {
        console.error("Error saving cart:", err);
    }
};

// GET /api/cart - Get cart items
router.get('/', (req, res) => {
    res.json(readCart());
});

// POST /api/cart - Add item
router.post('/', (req, res) => {
    let cart = readCart();
    const product = req.body;

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    res.json(cart);
});

// PUT /api/cart/:id - Update quantity
router.put('/:id', (req, res) => {
    let cart = readCart();
    const { qty } = req.body;
    const { id } = req.params;

    const item = cart.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.qty = qty;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveCart(cart);
    res.json(cart);
});

// DELETE /api/cart/:id - Remove item
router.delete('/:id', (req, res) => {
    let cart = readCart();
    cart = cart.filter(i => i.id !== req.params.id);
    saveCart(cart);
    res.json(cart);
});

module.exports = router;
