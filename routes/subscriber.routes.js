import express from 'express';
import Subscriber from '../models/Subscriber.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/subscribers — public newsletter signup
router.post('/', async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      return res.status(200).json({ message: 'Already subscribed', subscriber: existing });
    }

    const subscriber = await Subscriber.create({
      email,
      source: req.body.source || 'footer',
    });

    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: 'Already subscribed' });
    }
    res.status(400).json({ message: error.message });
  }
});

// GET /api/subscribers — admin list
router.get('/', protect, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      Subscriber.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Subscriber.countDocuments(),
    ]);

    res.json({
      subscribers,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/subscribers/:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Subscriber.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Subscriber not found' });
    await doc.deleteOne();
    res.json({ message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
