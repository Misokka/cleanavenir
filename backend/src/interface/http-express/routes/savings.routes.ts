import { Router } from 'express';
import { 
  listUserSavingsController,
  createSavingController,
  getCurrentRateController,
  applyDailyInterestController,
  getSavingController
} from '../controllers/savings';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Route publique pour obtenir le taux actuel
router.get('/rate', getCurrentRateController);

// Routes protégées
router.use(requireAuth);
router.get('/', listUserSavingsController);
router.get('/:id', getSavingController);
router.post('/', createSavingController);
router.post('/apply-interest', applyDailyInterestController);

export const savingsRoutes = router;
