import { Router } from 'express';
import { 
  listRecentOperationsController, 
  transferController,
  getOperationsHistoryController 
} from '../controllers/operations';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();
router.use(requireAuth);
router.get('/recent', listRecentOperationsController);
router.get('/history', getOperationsHistoryController);
router.post('/transfer', transferController);

export const operationRoutes = router;
