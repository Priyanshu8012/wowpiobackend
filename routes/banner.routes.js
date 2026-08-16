import express from 'express';
import Banner from '../models/Banner.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/banner (public)
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/banner/all (admin)
router.get('/all', protect, async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ order: 1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/banner (admin)
router.post('/', protect, async (req, res) => {
    try {
        const banner = new Banner(req.body);
        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/banner/:id (admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            Object.assign(banner, req.body);
            const updatedBanner = await banner.save();
            res.json(updatedBanner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/banner/:id (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/banner/reorder (admin)
router.put('/reorder/all', protect, async (req, res) => {
    try {
        const updates = req.body; // array of { id, order }
        for (const update of updates) {
            await Banner.findByIdAndUpdate(update.id, { order: update.order });
        }
        res.json({ message: 'Banners reordered' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
