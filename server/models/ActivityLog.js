import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        'created', 'viewed', 'assigned', 'approved', 'rejected',
        'changes_requested', 'bulk_action', 'login', 'logout', 'profile_update',
      ],
      required: true,
    },
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    details: {
      before: { type: mongoose.Schema.Types.Mixed },
      after: { type: mongoose.Schema.Types.Mixed },
      description: { type: String },
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true },
);

activityLogSchema.index({ action: 1 });
activityLogSchema.index({ entity: 1, entityId: 1 });
activityLogSchema.index({ performedBy: 1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
