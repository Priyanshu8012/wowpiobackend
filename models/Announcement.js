import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      default: 'New: 20L sealed pack for homes & offices — order via WhatsApp.',
    },
    ctaText: {
      type: String,
      default: 'Order now',
    },
    /** whatsapp | link | none */
    ctaType: {
      type: String,
      enum: ['whatsapp', 'link', 'none'],
      default: 'whatsapp',
    },
    /** Used when ctaType is whatsapp */
    ctaMessage: {
      type: String,
      default: 'Hi WOWPIO, I want to order the 20L sealed pack.',
    },
    /** Internal path (/products) or full URL when ctaType is link */
    ctaLink: {
      type: String,
      default: '/products',
    },
    secondaryText: {
      type: String,
      default: 'Brand brochure',
    },
    secondaryLink: {
      type: String,
      default: '/brochure',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
