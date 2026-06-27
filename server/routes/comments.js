import { Router } from 'express';
import { commentController } from '../controllers/commentController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', commentController.getBySubmission);
router.post('/', commentController.create);

export { router as commentRoutes };
