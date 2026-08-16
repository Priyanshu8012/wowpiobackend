import express from 'express';
import About from '../models/About.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/about (public)
router.get('/', async (req, res) => {
    try {
        const about = await About.findOne();
        if (about) {
            res.json(about);
        } else {
            res.json({ heading: '', body: '', imageUrl: '' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/about (admin)
router.put('/', protect, async (req, res) => {
    try {
        let about = await About.findOne();
        if (about) {
            Object.assign(about, req.body);
            const updatedAbout = await about.save();
            res.json(updatedAbout);
        } else {
            about = new About(req.body);
            const createdAbout = await about.save();
            res.status(201).json(createdAbout);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
