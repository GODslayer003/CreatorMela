import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ActivityLog } from '../models/ActivityLog.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const authService = {
  async login(email, password, ipAddress, userAgent) {
    const user = await Admin.findOne({ email, isActive: true }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    await user.save();

    await ActivityLog.create({
      action: 'login',
      entity: 'Admin',
      entityId: user._id,
      performedBy: user._id,
      details: { description: 'Logged in' },
      ipAddress,
      userAgent,
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  },

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
      const user = await Admin.findById(decoded.id).select('+refreshToken');

      if (!user || user.refreshToken !== token) {
        throw new Error('Invalid refresh token');
      }

      const tokens = generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch {
      throw new Error('Invalid refresh token');
    }
  },

  async logout(userId, ipAddress, userAgent) {
    await Admin.findByIdAndUpdate(userId, { refreshToken: null });

    await ActivityLog.create({
      action: 'logout',
      entity: 'Admin',
      entityId: userId,
      performedBy: userId,
      details: { description: 'Logged out' },
      ipAddress,
      userAgent,
    });
  },

  async getMe(userId) {
    const user = await Admin.findById(userId).select('-password -refreshToken');
    if (!user) throw new Error('User not found');
    return user;
  },
};
