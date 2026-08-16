import mongoose from 'mongoose';

const chatEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    interest: {
      type: String,
      enum: ['order', 'distributor', 'bulk', 'support', 'other'],
      default: 'order',
    },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('ChatEnquiry', chatEnquirySchema);
