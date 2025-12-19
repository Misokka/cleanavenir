import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import { 
  requestLoanController,
  simulateLoanController,
  listLoansController,
  approveLoanController 
} from '../controllers/loans';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(requireAuth);

// Routes accessibles par tous les utilisateurs connectés
router.post('/simulate', simulateLoanController);

// Routes CLIENT - Demander un prêt et voir ses prêts
router.post('/request', requestLoanController);
router.get('/', listLoansController);

// Routes ADVISOR - Approuver un prêt
router.post('/:id/approve', checkRole(['ADVISOR', 'DIRECTOR']), approveLoanController);

export const loanRoutes = router;
