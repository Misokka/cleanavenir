import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { GetStockController, GetStockPriceHistoryController, ListStocksController } from "../controllers/stocks";

const router = Router();

router.use(requireAuth);

router.get('/', ListStocksController);
router.get('/stock-price-history/:stockId', GetStockPriceHistoryController )
router.get('/:stockId', GetStockController);

export const stocksRoutes = router;