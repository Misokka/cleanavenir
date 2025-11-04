import { Router } from 'express';
import { listAccountsController, getAccountController } from '../controllers/accounts';
import { listAccountOperationsController } from '../controllers/operations';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', listAccountsController);
router.get('/:id', getAccountController);
router.get('/:id/operations', listAccountOperationsController);

export const accountRoutes = router;
