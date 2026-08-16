import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import upload, { detectMediaType } from './middleware/upload.js';

import authRoutes from './routes/auth.routes.js';
import bannerRoutes from './routes/banner.routes.js';
import aboutRoutes from './routes/about.routes.js';
import contactRoutes from './routes/contact.routes.js';
import productRoutes from './routes/product.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import heroRoutes from './routes/hero.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';
import batchRoutes from './routes/batch.routes.js';
import chatEnquiryRoutes from './routes/chatEnquiry.routes.js';
import settingsRoutes from './routes/settings.routes.js';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/chat-enquiries', chatEnquiryRoutes);
app.use('/api/settings', settingsRoutes);

// Upload endpoint — images (incl. animated GIF) + short videos
app.post('/api/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const mediaType = detectMediaType(req.file.filename);
        res.json({ imageUrl, mediaType, mediaUrl: imageUrl });
    });
});

// Basic Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on port ${PORT}`);
});
