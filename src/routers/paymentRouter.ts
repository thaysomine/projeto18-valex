import { Router } from "express";
import { createPayment} from "../controllers/paymentController.js";

const paymentRouter = Router();

paymentRouter.post("/payment/card/:id", createPayment);

export default paymentRouter;