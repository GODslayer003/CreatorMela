import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    budget: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft' },
    category: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true, paranoid: true },
);

campaignSchema.index({ creator: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ category: 1 });

export const Campaign = mongoose.model('Campaign', campaignSchema);
