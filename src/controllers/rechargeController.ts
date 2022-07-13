import { Request, Response } from 'express';
import * as rechargeServices from '../services/rechargeServices.js';

export async function rechargeCard (req: Request, res: Response) {
    const { id } = req.params;
    const cardId = parseInt(id);
    //TODO: validar dados (joi), api key da empresa
    // TODO: só consigo passar valor inteiro por enquanto
    const { value }: { value: number } = req.body;

    await rechargeServices.rechargeCard(cardId, value);
    res.sendStatus(201);
}
