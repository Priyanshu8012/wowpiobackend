import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AdminUser from '../models/AdminUser.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await AdminUser.findOne({ username });

        if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                displayName: admin.displayName || 'WOWPIO Admin',
                roleLabel: admin.roleLabel || 'Site owner',
                avatarUrl: admin.avatarUrl || '',
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    res.json({
        _id: req.admin._id,
        username: req.admin.username,
        displayName: req.admin.displayName || 'WOWPIO Admin',
        roleLabel: req.admin.roleLabel || 'Site owner',
        avatarUrl: req.admin.avatarUrl || '',
    });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const admin = await AdminUser.findById(req.admin._id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (req.body.displayName !== undefined) {
            admin.displayName = String(req.body.displayName || '').trim() || 'WOWPIO Admin';
        }
        if (req.body.roleLabel !== undefined) {
            admin.roleLabel = String(req.body.roleLabel || '').trim() || 'Site owner';
        }
        if (req.body.avatarUrl !== undefined) {
            admin.avatarUrl = req.body.avatarUrl || '';
        }

        await admin.save();

        res.json({
            _id: admin._id,
            username: admin.username,
            displayName: admin.displayName || 'WOWPIO Admin',
            roleLabel: admin.roleLabel || 'Site owner',
            avatarUrl: admin.avatarUrl || '',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const admin = await AdminUser.findById(req.admin._id);

        if (admin && (await bcrypt.compare(currentPassword, admin.passwordHash))) {
            const salt = await bcrypt.genSalt(10);
            admin.passwordHash = await bcrypt.hash(newPassword, salt);
            await admin.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Incorrect current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
