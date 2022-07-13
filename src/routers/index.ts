import { Router } from "express";

import cardRouter from "./cardRouter.js";
import rechargeRouter from "./rechargeRouter.js";

const routers = Router();

routers.use(cardRouter);
routers.use(rechargeRouter);

export default routers;