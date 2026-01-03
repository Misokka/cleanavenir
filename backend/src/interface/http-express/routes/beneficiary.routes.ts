import { Router } from 'express';
import {
  addBeneficiaryController,
  listBeneficiariesController,
  deleteBeneficiaryController,
  updateBeneficiaryController,
} from '../controllers/beneficiaries';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', addBeneficiaryController);
router.get('/', listBeneficiariesController);
router.put('/:id', updateBeneficiaryController);
router.delete('/:id', deleteBeneficiaryController);

export const beneficiaryRoutes = router;
