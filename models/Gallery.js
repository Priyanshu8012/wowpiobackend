import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    bgClass: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        required: true
    },
    /** image | video — video/mp4/webm or animated gif as image */
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
    }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
