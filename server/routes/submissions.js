import { Router } from 'express';
import { submissionController } from '../controllers/submissionController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', submissionController.getAll);
router.get('/:id', submissionController.getById);
router.post('/:id/approve', authorize('admin', 'moderator'), submissionController.approve);
router.post('/:id/reject', authorize('admin', 'moderator'), submissionController.reject);
router.post('/:id/request-changes', authorize('admin', 'moderator'), submissionController.requestChanges);
router.post('/:id/assign', authorize('admin'), submissionController.assign);
router.post('/bulk', authorize('admin', 'moderator'), submissionController.bulkAction);

export { router as submissionRoutes };
