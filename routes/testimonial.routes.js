import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/testimonials (public)
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/testimonials (admin)
router.post('/', protect, async (req, res) => {
    try {
        const testimonial = new Testimonial(req.body);
        const createdTestimonial = await testimonial.save();
        res.status(201).json(createdTestimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/testimonials/:id (admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            testimonial.name = req.body.name || testimonial.name;
            testimonial.role = req.body.role || testimonial.role;
            testimonial.review = req.body.review || testimonial.review;
            testimonial.rating = req.body.rating || testimonial.rating;
            testimonial.initials = req.body.initials || testimonial.initials;

            const updatedTestimonial = await testimonial.save();
            res.json(updatedTestimonial);
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/testimonials/:id (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            await testimonial.deleteOne();
            res.json({ message: 'Testimonial removed' });
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
