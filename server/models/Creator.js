import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String },
    bio: { type: String },
    category: { type: String, required: true },
    followers: { type: Number, default: 0 },
    platforms: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true, paranoid: true },
);

creatorSchema.index({ category: 1 });
creatorSchema.index({ name: 'text', email: 'text' });

export const Creator = mongoose.model('Creator', creatorSchema);
