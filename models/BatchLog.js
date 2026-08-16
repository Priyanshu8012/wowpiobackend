import mongoose from 'mongoose';

const batchLogSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    /** Optional pack size e.g. 1L, 20L */
    productSize: {
      type: String,
      default: '',
      trim: true,
    },
    /** When this batch was manufactured (date + time) */
    manufacturedAt: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    placeOfMfg: {
      type: String,
      default: 'Bachcoach',
      trim: true,
    },
    factoryName: {
      type: String,
      default: 'WOWPIO Packaged Drinking Water Plant',
      trim: true,
    },
    licenseNumber: {
      type: String,
      default: 'FSSAI Licensed',
      trim: true,
    },
    batchCode: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tds: {
      type: Number,
      default: null,
    },
    ph: {
      type: Number,
      default: null,
    },
    calcium: {
      type: Number,
      default: null,
    },
    magnesium: {
      type: Number,
      default: null,
    },
    turbidity: {
      type: Number,
      default: null,
    },
    microbial: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BatchLog', batchLogSchema);
