import express from 'express';
import Hero from '../models/Hero.js';
import { protect } from '../middleware/auth.js';
import { detectMediaType } from '../middleware/upload.js';

const router = express.Router();

// GET /api/hero (public)
router.get('/', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) {
            hero = new Hero();
            await hero.save();
        }
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/hero (admin)
router.put('/', protect, async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) {
            hero = new Hero(req.body);
        } else {
            hero.title = req.body.title || hero.title;
            hero.description = req.body.description || hero.description;
            hero.imageUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : hero.imageUrl;
            if (req.body.mediaType !== undefined) {
                hero.mediaType = req.body.mediaType;
            } else if (req.body.imageUrl) {
                hero.mediaType = detectMediaType(req.body.imageUrl);
            } else if (req.body.imageUrl === '') {
                hero.mediaType = 'image';
            }
        }

        const updatedHero = await hero.save();
        res.json(updatedHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
