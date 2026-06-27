import { Submission } from '../models/Submission.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { Review } from '../models/Review.js';

export const dashboardService = {
  async getStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [pending, approvedToday, rejectedToday, changesRequested, totalApproved, totalRejected] =
      await Promise.all([
        Submission.countDocuments({ status: 'pending' }),
        Submission.countDocuments({ status: 'approved', updatedAt: { $gte: startOfDay } }),
        Submission.countDocuments({ status: 'rejected', updatedAt: { $gte: startOfDay } }),
        Submission.countDocuments({ status: 'changes_requested' }),
        Submission.countDocuments({ status: 'approved' }),
        Submission.countDocuments({ status: 'rejected' }),
      ]);

    const approvalRate =
      totalApproved + totalRejected > 0
        ? (totalApproved / (totalApproved + totalRejected)) * 100
        : 0;

    const avgReviewTime = await Review.aggregate([
      {
        $lookup: {
          from: 'submissions',
          localField: 'submission',
          foreignField: '_id',
          as: 'sub',
        },
      },
      { $unwind: '$sub' },
      {
        $project: {
          diff: { $subtract: ['$createdAt', '$sub.createdAt'] },
        },
      },
      { $group: { _id: null, avg: { $avg: '$diff' } } },
    ]);

    const pendingByCategory = await Submission.aggregate([
      { $match: { status: 'pending' } },
      {
        $lookup: {
          from: 'creators',
          localField: 'creator',
          foreignField: '_id',
          as: 'creatorData',
        },
      },
      { $unwind: '$creatorData' },
      {
        $group: {
          _id: '$creatorData.category',
          count: { $sum: 1 },
        },
      },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    const weeklyReviews = await Review.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            action: '$action',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      pendingApprovals: pending,
      approvedToday,
      rejectedToday,
      changesRequested,
      approvalRate: Math.round(approvalRate * 10) / 10,
      averageReviewTime: avgReviewTime[0]
        ? Math.round((avgReviewTime[0].avg / 60000) * 10) / 10
        : 0,
      activeModerators: 0,
      pendingByCategory,
      weeklyReviews: [],
      recentActivities: [],
    };
  },
};
