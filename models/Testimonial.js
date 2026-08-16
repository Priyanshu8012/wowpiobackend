import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    initials: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
