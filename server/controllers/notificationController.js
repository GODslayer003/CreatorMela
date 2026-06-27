import { Notification } from '../models/Notification.js';

export const notificationController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 20, isRead } = req.query;

      const filter = { user: req.user._id };
      if (isRead !== undefined) filter.isRead = isRead === 'true';

      const [data, total] = await Promise.all([
        Notification.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit)),
        Notification.countDocuments(filter),
      ]);

      res.json({
        success: true,
        message: 'Notifications fetched',
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

  async markAsRead(req, res, next) {
    try {
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
      res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
      res.json({ success: true, message: 'All marked as read' });
    } catch (error) {
      next(error);
    }
  },
};
