import { Review } from '../models/Review.js';

export const reviewController = {
  async getBySubmission(req, res, next) {
    try {
      const { submission, page = 1, limit = 20 } = req.query;

      const filter = {};
      if (submission) filter.submission = submission;

      const [data, total] = await Promise.all([
        Review.find(filter)
          .populate('reviewer', 'name email avatar')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit)),
        Review.countDocuments(filter),
      ]);

      res.json({
        success: true,
        message: 'Reviews fetched',
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
