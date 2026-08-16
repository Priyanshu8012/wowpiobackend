import express from 'express';
import Announcement from '../models/Announcement.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

async function getOrCreate() {
  let doc = await Announcement.findOne();
  if (!doc) {
    doc = new Announcement();
    await doc.save();
  }
  return doc;
}

// GET /api/announcement — public (active bar only)
router.get('/', async (req, res) => {
  try {
    const doc = await getOrCreate();
    if (!doc.isActive) {
      return res.json({ isActive: false });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/announcement/admin — full doc for admin
router.get('/admin', protect, async (req, res) => {
  try {
    const doc = await getOrCreate();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/announcement — admin update
router.put('/', protect, async (req, res) => {
  try {
    let doc = await Announcement.findOne();
    if (!doc) {
      doc = new Announcement(req.body);
    } else {
      const fields = [
        'text',
        'ctaText',
        'ctaType',
        'ctaMessage',
        'ctaLink',
        'secondaryText',
        'secondaryLink',
        'isActive',
      ];
      fields.forEach((key) => {
        if (req.body[key] !== undefined) doc[key] = req.body[key];
      });
    }
    const updated = await doc.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
