import { Router } from 'express';
import { 
  listClientSavingsController,
  createSavingController,
  applyDailyInterestController,
  getSavingController
} from '../controllers/savings';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Route publique pour obtenir le taux actuel
// router.get('/rate', getCurrentRateController); // transformer la route pour avoir la rate d'un savingproduct

// Routes protégées
router.use(requireAuth);
router.get('/', listClientSavingsController);
router.get('/:id', getSavingController);
router.post('/', createSavingController);
router.post('/apply-interest', applyDailyInterestController);

export const savingsRoutes = router;
