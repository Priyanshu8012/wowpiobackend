import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products (public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/products (admin)
router.post('/', protect, async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = req.body.name || product.name;
            product.size = req.body.size || product.size;
            product.category = req.body.category || product.category;
            product.description = req.body.description || product.description;
            product.price = req.body.price || product.price;
            product.originalPrice = req.body.originalPrice !== undefined ? req.body.originalPrice : product.originalPrice;
            product.badge = req.body.badge !== undefined ? req.body.badge : product.badge;
            product.isJar = req.body.isJar !== undefined ? req.body.isJar : product.isJar;
            product.imageUrl = req.body.imageUrl || product.imageUrl;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
