import { Router } from 'express';
import { 
  listSavingAccountsController, 
  getCurrentSavingRateController 
} from '../controllers/savings';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();
router.use(requireAuth);
router.get('/accounts', listSavingAccountsController);
router.get('/rates/current', getCurrentSavingRateController);

export const savingsRoutes = router;
