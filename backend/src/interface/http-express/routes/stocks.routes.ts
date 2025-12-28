import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { ListStocksController } from "../controllers/stocks";

const router = Router();

router.use(requireAuth);

router.get('/', ListStocksController);

export const stocksRoutes = router;