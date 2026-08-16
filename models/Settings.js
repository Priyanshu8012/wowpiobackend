import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    logoUrl: {
        type: String,
        default: '/logo.png'
    }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
