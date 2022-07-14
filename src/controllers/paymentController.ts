import { Request, Response } from "express";
import * as paymentServices from "../services/paymentServices.js";

export async function createPayment(req: Request, res: Response) {
   const { id } = req.params;
   const cardId = parseInt(id);
   const { password, businessId, value } : {password: string, businessId: number, value: number} = req.body;

   await paymentServices.paymentCard(cardId, password, businessId, value);
   res.sendStatus(201);
}