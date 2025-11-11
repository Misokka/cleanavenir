import { Router } from 'express';
import { 
  createSavingController,
  listUserSavingsController,
  applyDailyInterestController,
  getCurrentRateController
} from '../controllers/savings';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();


router.get('/rate', getCurrentRateController);

router.use(requireAuth);

router.get('/', listUserSavingsController);
router.post('/', createSavingController);

router.post('/apply-interest', applyDailyInterestController);

export const savingsRoutes = router;
