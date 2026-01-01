import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { ListMyOrdersController, PlaceOrderControlller } from "../controllers/orders";

const router = Router();

router.get("/list-my-orders", requireAuth, ListMyOrdersController);
router.post("/create", requireAuth, PlaceOrderControlller);

export const orderRoutes = router;