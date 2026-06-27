import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/stats', authenticate, dashboardController.getStats);

export { router as dashboardRoutes };
