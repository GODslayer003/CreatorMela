import { Comment } from '../models/Comment.js';

export const commentController = {
  async getBySubmission(req, res, next) {
    try {
      const { submission, page = 1, limit = 50 } = req.query;

      const filter = {};
      if (submission) filter.submission = submission;

      const [data, total] = await Promise.all([
        Comment.find(filter)
          .populate('author', 'name email avatar')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit)),
        Comment.countDocuments(filter),
      ]);

      res.json({
        success: true,
        message: 'Comments fetched',
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

  async create(req, res, next) {
    try {
      const { submission, content, isInternal } = req.body;

      const comment = await Comment.create({
        submission,
        author: req.user._id,
        content,
        isInternal,
      });

      const populated = await comment.populate('author', 'name email avatar');

      res.status(201).json({ success: true, message: 'Comment created', data: populated });
    } catch (error) {
      next(error);
    }
  },
};
