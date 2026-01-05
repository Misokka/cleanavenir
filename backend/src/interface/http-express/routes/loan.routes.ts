import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import { 
  requestLoanController,
  simulateLoanController,
  listLoansController,
  getLoanByIdController,
  approveLoanController,
  rejectLoanController,
  listPendingLoansController,
  listAdvisorClientsController
} from '../controllers/loans';
import { getClientAccountsController } from '../controllers/advisor/getClientAccountsController';
import { getClientInfoController } from '../controllers/advisor/getClientInfoController';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(requireAuth);

// Routes accessibles par tous les utilisateurs connectés
router.post('/simulate', simulateLoanController);

// Routes ADVISOR - Gérer les prêts (AVANT les routes avec :id)
router.get('/pending', checkRole(['ADVISOR', 'DIRECTOR']), listPendingLoansController);
router.get('/advisor/clients', checkRole(['ADVISOR', 'DIRECTOR']), listAdvisorClientsController);
router.get('/advisor/client/:clientId/accounts', checkRole(['ADVISOR', 'DIRECTOR']), getClientAccountsController);
router.get('/advisor/client/:clientId/info', checkRole(['ADVISOR', 'DIRECTOR']), getClientInfoController);
router.post('/:id/approve', checkRole(['ADVISOR', 'DIRECTOR']), approveLoanController);
router.post('/:id/reject', checkRole(['ADVISOR', 'DIRECTOR']), rejectLoanController);

// Routes CLIENT - Demander un prêt et voir ses prêts
router.post('/request', requestLoanController);
router.get('/', listLoansController);
router.get('/:id', getLoanByIdController);

export const loanRoutes = router;
