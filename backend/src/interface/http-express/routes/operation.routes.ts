import { Router } from 'express';
import { listRecentOperationsController, transferController } from '../controllers/operations';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();
router.use(requireAuth);
router.get('/recent', listRecentOperationsController);
router.post('/transfer', transferController);

export const operationRoutes = router;
