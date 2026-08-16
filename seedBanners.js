import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Banner from './models/Banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const defaultBanners = [
    {
        order: 0,
        eyebrow: 'WOWO PIO',
        title: 'Purity in Every Drop',
        copy: 'Crystal-clear packaged drinking water — purified, sealed, and delivered fresh.',
        ctaText: 'Explore Products',
        imageUrl: '/uploads/image-1784431357805.png',
        isActive: true,
    },
    {
        order: 1,
        eyebrow: 'WOWO PIO',
        title: 'Science Behind Every Sip',
        copy: 'Multi-stage purification with RO, UV and ozonation for safety you can trust.',
        ctaText: 'See Our Process',
        imageUrl: '/uploads/image-1784431487639.png',
        isActive: true,
    },
    {
        order: 2,
        eyebrow: 'WOWO PIO',
        title: 'Fresh. Safe. Always Ready.',
        copy: 'From bottling line to your door — hygiene-first packaging for homes and partners.',
        ctaText: 'Partner With Us',
        imageUrl: '/uploads/image-1784432690556.png',
        isActive: true,
    },
];

const seedBanners = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Banner Seeding');

        const count = await Banner.countDocuments();
        if (count > 0) {
            console.log(`Found ${count} existing banner(s). Clearing and reseeding...`);
            await Banner.deleteMany({});
        }

        await Banner.insertMany(defaultBanners);
        console.log(`Seeded ${defaultBanners.length} banner slides successfully.`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedBanners();
