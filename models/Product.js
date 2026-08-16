import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    size: {
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
    price: {
        type: String,
        required: true
    },
    originalPrice: {
        type: String,
        default: ''
    },
    badge: {
        type: String,
        default: ''
    },
    isJar: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
