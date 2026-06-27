import { Submission } from '../models/Submission.js';
import { Review } from '../models/Review.js';
import { ActivityLog } from '../models/ActivityLog.js';

export const submissionController = {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        priority,
        type,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const filter = {};
      if (status) filter.status = { $in: status.split(',') };
      if (priority) filter.priority = { $in: priority.split(',') };
      if (type) filter.type = { $in: type.split(',') };
      if (search) filter.$text = { $search: search };

      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      const [data, total] = await Promise.all([
        Submission.find(filter)
          .populate('creator', 'name email avatar category')
          .populate('assignedTo', 'name email')
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(parseInt(limit)),
        Submission.countDocuments(filter),
      ]);

      res.json({
        success: true,
        message: 'Submissions fetched',
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const submission = await Submission.findById(req.params.id)
        .populate('creator')
        .populate('campaign')
        .populate('submittedBy', 'name email')
        .populate('assignedTo', 'name email');

      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      res.json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  },

  async approve(req, res, next) {
    try {
      const { id } = req.params;
      const { note } = req.body;

      const submission = await Submission.findById(id);
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      const previousStatus = submission.status;
      submission.status = 'approved';
      submission.lastReviewedAt = new Date();
      submission.reviewCount += 1;
      await submission.save();

      await Review.create({
        submission: id,
        reviewer: req.user._id,
        action: 'approve',
        note,
        previousStatus,
        newStatus: 'approved',
      });

      await ActivityLog.create({
        action: 'approved',
        entity: 'Submission',
        entityId: id,
        performedBy: req.user._id,
        details: { before: { status: previousStatus }, after: { status: 'approved' }, description: note },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({ success: true, message: 'Submission approved', data: submission });
    } catch (error) {
      next(error);
    }
  },

  async reject(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const submission = await Submission.findById(id);
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      const previousStatus = submission.status;
      submission.status = 'rejected';
      submission.lastReviewedAt = new Date();
      submission.reviewCount += 1;
      await submission.save();

      await Review.create({
        submission: id,
        reviewer: req.user._id,
        action: 'reject',
        reason,
        previousStatus,
        newStatus: 'rejected',
      });

      await ActivityLog.create({
        action: 'rejected',
        entity: 'Submission',
        entityId: id,
        performedBy: req.user._id,
        details: { before: { status: previousStatus }, after: { status: 'rejected' }, description: reason },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({ success: true, message: 'Submission rejected', data: submission });
    } catch (error) {
      next(error);
    }
  },

  async requestChanges(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const submission = await Submission.findById(id);
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      const previousStatus = submission.status;
      submission.status = 'changes_requested';
      submission.lastReviewedAt = new Date();
      submission.reviewCount += 1;
      await submission.save();

      await Review.create({
        submission: id,
        reviewer: req.user._id,
        action: 'request_changes',
        reason,
        previousStatus,
        newStatus: 'changes_requested',
      });

      await ActivityLog.create({
        action: 'changes_requested',
        entity: 'Submission',
        entityId: id,
        performedBy: req.user._id,
        details: { before: { status: previousStatus }, after: { status: 'changes_requested' }, description: reason },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({ success: true, message: 'Changes requested', data: submission });
    } catch (error) {
      next(error);
    }
  },

  async assign(req, res, next) {
    try {
      const { id } = req.params;
      const { reviewerId } = req.body;

      const submission = await Submission.findByIdAndUpdate(
        id,
        { assignedTo: reviewerId, status: 'under_review' },
        { new: true },
      );

      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      await ActivityLog.create({
        action: 'assigned',
        entity: 'Submission',
        entityId: id,
        performedBy: req.user._id,
        details: { after: { assignedTo: reviewerId }, description: 'Assigned to reviewer' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({ success: true, message: 'Reviewer assigned', data: submission });
    } catch (error) {
      next(error);
    }
  },

  async bulkAction(req, res, next) {
    try {
      const { ids, action, reason, reviewerId } = req.body;

      let update = {};
      if (action === 'approve') update = { status: 'approved' };
      else if (action === 'reject') update = { status: 'rejected' };
      else if (action === 'changes_requested') update = { status: 'changes_requested' };
      else if (action === 'assign') update = { assignedTo: reviewerId };

      const result = await Submission.updateMany({ _id: { $in: ids } }, update);

      await ActivityLog.create({
        action: 'bulk_action',
        entity: 'Submission',
        entityId: ids[0],
        performedBy: req.user._id,
        details: {
          description: `Bulk ${action} on ${ids.length} submissions`,
          after: { action, ids },
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        message: `Bulk action completed`,
        data: { processed: result.modifiedCount },
      });
    } catch (error) {
      next(error);
    }
  },
};
