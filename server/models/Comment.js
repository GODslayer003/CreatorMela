import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    content: { type: String, required: true },
    isInternal: { type: Boolean, default: false },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true, paranoid: true },
);

commentSchema.index({ submission: 1 });
commentSchema.index({ author: 1 });

export const Comment = mongoose.model('Comment', commentSchema);
