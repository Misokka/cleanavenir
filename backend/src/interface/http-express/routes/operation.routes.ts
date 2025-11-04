import { Router } from 'express';
import { listRecentOperationsController } from '../controllers/operations';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();
router.use(requireAuth);
router.get('/recent', listRecentOperationsController);

export const operationRoutes = router;
