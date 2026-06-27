import { ActivityLog } from '../models/ActivityLog.js';

export const activityLogController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 50, action, entity } = req.query;

      const filter = {};
      if (action) filter.action = { $in: action.split(',') };
      if (entity) filter.entity = entity;

      const [data, total] = await Promise.all([
        ActivityLog.find(filter)
          .populate('performedBy', 'name email avatar')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit)),
        ActivityLog.countDocuments(filter),
      ]);

      res.json({
        success: true,
        message: 'Activity logs fetched',
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
};
