import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { CreatePortfolioController, GetMyPortfolioController } from "../controllers/portfolios";

const router = Router();

router.get("/my-portfolio", requireAuth, GetMyPortfolioController);
router.post("/create", requireAuth, CreatePortfolioController);

export const portfolioRoutes = router;