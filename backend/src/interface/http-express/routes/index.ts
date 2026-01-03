import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { accountRoutes } from './account.routes';
import { operationRoutes } from './operation.routes';
import { savingsRoutes } from './savings.routes';
import { loanRoutes } from './loan.routes';
import { adminRoutes } from './admin.routes';
import { stocksRoutes } from './stocks.routes';
import { orderRoutes } from './order.routes';
import { portfolioRoutes } from './portfolio.routes';
import { beneficiaryRoutes } from './beneficiary.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/operations', operationRoutes);
router.use('/savings', savingsRoutes);
router.use('/loans', loanRoutes);
router.use('/admin', adminRoutes);
router.use('/stocks', stocksRoutes)
router.use("/orders", orderRoutes)
router.use("/portfolios", portfolioRoutes);
router.use('/beneficiaries', beneficiaryRoutes);

export { router as mainRouter };
