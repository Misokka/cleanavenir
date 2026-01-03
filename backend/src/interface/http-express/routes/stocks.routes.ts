import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { GetStockPriceHistoryController, ListStocksController } from "../controllers/stocks";

const router = Router();

router.use(requireAuth);

router.get('/', ListStocksController);
router.get('/stock-price-history/:stockId', GetStockPriceHistoryController )

export const stocksRoutes = router;