import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), userController.getAll);
router.get('/:id', userController.getById);

export { router as userRoutes };
