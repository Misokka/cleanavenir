import { Router } from 'express';
import { 
  listAccountsController, 
  getAccountController, 
  createAccountController,
  renameAccountController,
  deleteAccountController
} from '../controllers/accounts';
import { listAccountOperationsController } from '../controllers/operations';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', listAccountsController);
router.post('/', createAccountController);
router.get('/:id', getAccountController);
router.patch('/:id', renameAccountController);
router.delete('/:id', deleteAccountController);
router.get('/:id/operations', listAccountOperationsController);

export const accountRoutes = router;
