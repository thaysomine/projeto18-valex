import { Router } from "express";
import { rechargeCard } from "../controllers/rechargeController.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:id", rechargeCard);

export default rechargeRouter;