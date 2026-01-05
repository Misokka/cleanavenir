import { Router } from 'express';
import { requireAuth } from '../../../interface/http-express/middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import {  
  listClientsController,
  createClientController,
  updateClientController,
  deleteClientController,
  banClientController,
  unbanClientController,
  getStatisticsController,
  UpdateSavingProductController,
  CreateSavingProductController,
  ListSavingProductsController,
  EditStockController,
  createAccountForClientController,
  renameAccountByDirectorController,
  deleteAccountByDirectorController,
} from '../controllers/admin';

import { ListCompaniesController, CreateCompanyController, GetCompanyByIdController, UpdateCompanyController, DeleteCompanyController } from '../controllers/companies'; 


const router = Router();

// Toutes les routes admin nécessitent le rôle DIRECTOR
router.use(requireAuth);
router.use(checkRole(['DIRECTOR']));

// Gestion des clients (CRUD users)
router.get('/clients', listClientsController);
router.post('/clients', createClientController);
router.put('/clients/:userId', updateClientController);
router.delete('/clients/:userId', deleteClientController);
router.post('/clients/:id/ban', banClientController);
router.post('/clients/:id/unban', unbanClientController);

// Gestion des comptes bancaires des clients (par le Director)
router.post('/clients/:userId/accounts', createAccountForClientController);
router.put('/accounts/:accountId/rename', renameAccountByDirectorController);
router.delete('/accounts/:accountId', deleteAccountByDirectorController);

// Statistiques
router.get('/statistics', getStatisticsController);

// Produits d'épargne
router.post('/savings/products', CreateSavingProductController);
router.get('/savings/products', ListSavingProductsController);
router.put('/savings/products/:id', UpdateSavingProductController);

// Entreprises et actions
router.get('/companies', ListCompaniesController);
router.post('/companies', CreateCompanyController);
router.get('/companies/:id', GetCompanyByIdController);
router.put('/companies/:id', UpdateCompanyController);
router.delete('/companies/:id', DeleteCompanyController);
router.put('/stocks/:stockId/edit', EditStockController);

export const adminRoutes = router;