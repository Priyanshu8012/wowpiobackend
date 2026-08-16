import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    order: { type: Number, default: 0 },
    eyebrow: { type: String, required: true },
    title: { type: String, required: true },
    copy: { type: String, required: true },
    ctaText: { type: String, required: true },
    imageUrl: { type: String, required: true },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
