import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      default: 'WOWPIO Admin',
      trim: true,
    },
    roleLabel: {
      type: String,
      default: 'Site owner',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('AdminUser', adminUserSchema);
