import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { GetStockController, GetStockPriceHistoryController, ListStocksController, CreateStockController, UpdateStockController, DeleteStockController } from "../controllers/stocks";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

router.use(requireAuth);

router.get('/', ListStocksController);
router.post('/', checkRole(['DIRECTOR']), CreateStockController);
router.get('/stock-price-history/:stockId', GetStockPriceHistoryController )
router.get('/:stockId', GetStockController);
router.put('/:stockId', checkRole(['DIRECTOR']), UpdateStockController);
router.delete('/:stockId', checkRole(['DIRECTOR']), DeleteStockController);

export const stocksRoutes = router;