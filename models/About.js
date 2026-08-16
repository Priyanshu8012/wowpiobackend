import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String, required: true },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
    }
}, { timestamps: true });

export default mongoose.model('About', aboutSchema);
