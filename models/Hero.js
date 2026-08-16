import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Purity You Can Trust & Feel'
    },
    description: {
        type: String,
        required: true,
        default: 'Fortified with essential Magnesium and Potassium, WOWPIO delivers pristine hydration tailored for high-performance lifestyles. Sourced deep, sealed touchless.'
    },
    imageUrl: {
        type: String,
        required: false
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
    }
}, { timestamps: true });

export default mongoose.model('Hero', heroSchema);
