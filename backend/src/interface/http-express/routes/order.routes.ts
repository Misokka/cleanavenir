import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { ListMyOrdersController, PlaceOrderControlller, ShowBestBuyAndSellOrderController } from "../controllers/orders";

const router = Router();

router.get("/list-my-orders", requireAuth, ListMyOrdersController);
router.post("/create", requireAuth, PlaceOrderControlller);
router.get("/show-best-buy-and-sell/:stockId", requireAuth, ShowBestBuyAndSellOrderController)

export const orderRoutes = router;