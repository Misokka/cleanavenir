import { Router } from 'express';
import { requireAuth, checkRole } from '../middlewares/authMiddleware';
import { 
  requestLoanController,
  simulateLoanController,
  listLoansController,
  approveLoanController 
} from '../controllers/loans';

const router = Router();

// Routes protégées CLIENT
router.use(requireAuth);
router.post('/simulate', simulateLoanController);
router.post('/request', requestLoanController);
router.get('/', listLoansController);

// Routes protégées CONSEILLER
router.post('/:id/approve', checkRole(['ADVISOR']), approveLoanController);

export const loansRoutes = router;