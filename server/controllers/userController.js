import { Admin } from '../models/Admin.js';

export const userController = {
  async getAll(req, res, next) {
    try {
      const users = await Admin.find({ isActive: true }).select('-password -refreshToken');
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await Admin.findById(req.params.id).select('-password -refreshToken');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
};
