import { Router } from 'express';
import { requireAuth } from '../../../interface/http-express/middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import {  
  listClientsController,
  banClientController,
  getStatisticsController,
  UpdateSavingProductController,
  CreateSavingProductController,
  ListSavingProductsController
} from '../controllers/admin';


const router = Router();

// Toutes les routes admin nécessitent le rôle DIRECTOR
router.use(requireAuth);
router.use(checkRole(['DIRECTOR']));

router.get('/clients', listClientsController);
router.post('/clients/:id/ban', banClientController);
router.get('/statistics', getStatisticsController);
router.post('/savings/products', CreateSavingProductController);
router.get('/savings/products', ListSavingProductsController);
router.put('/savings/products/:id', UpdateSavingProductController);

export const adminRoutes = router;