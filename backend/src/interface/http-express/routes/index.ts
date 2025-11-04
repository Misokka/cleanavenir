import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { accountRoutes } from './account.routes';
import { operationRoutes } from './operation.routes';
import { savingsRoutes } from './savings.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/operations', operationRoutes);
router.use('/savings', savingsRoutes);

export { router as mainRouter };
