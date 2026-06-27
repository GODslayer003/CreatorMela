import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['creator_profile', 'campaign', 'content', 'bio_update', 'portfolio'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'changes_requested', 'archived'],
      default: 'pending',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    content: {
      text: { type: String },
      mediaUrls: [{ type: String }],
      links: [{ type: String }],
    },
    tags: [{ type: String }],
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    reviewCount: { type: Number, default: 0 },
    lastReviewedAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, paranoid: true },
);

submissionSchema.index({ status: 1 });
submissionSchema.index({ priority: 1 });
submissionSchema.index({ type: 1 });
submissionSchema.index({ creator: 1 });
submissionSchema.index({ assignedTo: 1 });
submissionSchema.index({ createdAt: -1 });
submissionSchema.index({ title: 'text', description: 'text' });

export const Submission = mongoose.model('Submission', submissionSchema);
