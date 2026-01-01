const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../products.json');

const readProducts = () => {
    try {
        if (!fs.existsSync(PRODUCTS_FILE)) return [];
        return JSON.parse(fs.readFileSync(PRODUCTS_FILE));
    } catch (err) {
        return [];
    }
};

// GET /api/products - Get all products
router.get('/', (req, res) => {
    let products = readProducts();

    // Filtering
    const { search, category } = req.query;
    if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
    }
    if (search) {
        products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.json(products);
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

module.exports = router;
