import { Router } from 'express';
import { activityLogController } from '../controllers/activityLogController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', activityLogController.getAll);

export { router as activityLogRoutes };
