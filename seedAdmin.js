import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import AdminUser from './models/AdminUser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        const existingAdmin = await AdminUser.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Overwriting password...');
            existingAdmin.passwordHash = await bcrypt.hash('wowpio2026', 10);
            await existingAdmin.save();
            console.log('Admin password reset successfully.');
        } else {
            console.log('Creating admin user...');
            const passwordHash = await bcrypt.hash('wowpio2026', 10);
            const admin = new AdminUser({
                username: 'admin',
                passwordHash
            });
            await admin.save();
            console.log('Admin user created successfully.');
        }
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
