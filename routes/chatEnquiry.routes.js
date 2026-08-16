import express from 'express';
import ChatEnquiry from '../models/ChatEnquiry.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/chat-enquiries — public form from chatbot
router.post('/', async (req, res) => {
  try {
    const { name, phone, email = '', interest = 'order', message } = req.body;

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Name, phone, and message are required' });
    }

    const enquiry = await ChatEnquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: String(email || '').trim(),
      interest,
      message: message.trim(),
    });

    res.status(201).json({ message: 'Enquiry submitted successfully', id: enquiry._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/chat-enquiries — admin list
router.get('/', protect, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const enquiries = await ChatEnquiry.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ChatEnquiry.countDocuments();
    const unread = await ChatEnquiry.countDocuments({ isRead: false });

    res.json({
      enquiries,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
      unread,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/chat-enquiries/unread-count — admin
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await ChatEnquiry.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/chat-enquiries/:id/read — admin
router.put('/:id/read', protect, async (req, res) => {
  try {
    const enquiry = await ChatEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    enquiry.isRead = true;
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/chat-enquiries/:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const enquiry = await ChatEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    await enquiry.deleteOne();
    res.json({ message: 'Enquiry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
