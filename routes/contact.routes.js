import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contact (public)
router.post('/', async (req, res) => {
    try {
        const message = new ContactMessage(req.body);
        await message.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/contact (admin)
router.get('/', protect, async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const messages = await ContactMessage.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ContactMessage.countDocuments();
        const unread = await ContactMessage.countDocuments({ isRead: false });

        res.json({
            messages,
            page,
            pages: Math.ceil(total / limit),
            total,
            unread
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/contact/unread-count (admin)
router.get('/unread-count', protect, async (req, res) => {
    try {
        const count = await ContactMessage.countDocuments({ isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/contact/:id/read (admin)
router.put('/:id/read', protect, async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (message) {
            message.isRead = true;
            await message.save();
            res.json(message);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/contact/:id (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (message) {
            await message.deleteOne();
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
