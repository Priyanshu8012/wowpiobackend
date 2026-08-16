import express from 'express';
import Gallery from '../models/Gallery.js';
import { protect } from '../middleware/auth.js';
import { detectMediaType } from '../middleware/upload.js';

const router = express.Router();

// GET /api/gallery (public)
router.get('/', async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/gallery (admin)
router.post('/', protect, async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.imageUrl && !payload.mediaType) {
            payload.mediaType = detectMediaType(payload.imageUrl);
        }
        const item = new Gallery(payload);
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/gallery/:id (admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (item) {
            item.title = req.body.title || item.title;
            item.category = req.body.category || item.category;
            item.description = req.body.description || item.description;
            item.bgClass = req.body.bgClass !== undefined ? req.body.bgClass : item.bgClass;
            if (req.body.imageUrl !== undefined) item.imageUrl = req.body.imageUrl;
            if (req.body.mediaType !== undefined) {
                item.mediaType = req.body.mediaType;
            } else if (req.body.imageUrl) {
                item.mediaType = detectMediaType(req.body.imageUrl);
            }

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Gallery item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/gallery/:id (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Gallery item removed' });
        } else {
            res.status(404).json({ message: 'Gallery item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
