import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRoutes } from './routes/auth.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { submissionRoutes } from './routes/submissions.js';
import { reviewRoutes } from './routes/reviews.js';
import { commentRoutes } from './routes/comments.js';
import { activityLogRoutes } from './routes/activityLogs.js';
import { notificationRoutes } from './routes/notifications.js';
import { userRoutes } from './routes/users.js';

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/activity-logs', activityLogRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      process.stdout.write(`Server running on port ${env.PORT}\n`);
    });
  } catch (err) {
    process.stderr.write(`Failed to start: ${err.message}\n`);
    process.exit(1);
  }
};

start();

export default app;
