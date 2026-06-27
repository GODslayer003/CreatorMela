import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: { type: String, enum: ['approve', 'reject', 'request_changes'], required: true },
    note: { type: String },
    reason: { type: String },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
  },
  { timestamps: true },
);

reviewSchema.index({ submission: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
