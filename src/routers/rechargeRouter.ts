import { Router } from "express";
import { rechargeCard } from "../controllers/rechargeController.js";
import { validateKey } from "../middlewares/validateKey.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:id", validateKey, rechargeCard);

export default rechargeRouter;