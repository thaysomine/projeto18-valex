import { Request, Response } from 'express';
import * as cardServices from '../services/cardServices.js';
import * as cardRepository from '../repositories/cardRepository.js';

export async function createCard(req: Request, res: Response) {
    const { employeeId, type } : { employeeId : number, type: cardRepository.TransactionTypes } = req.body;
    await cardServices.createCard(employeeId, type);

    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const { cardId } : { cardId: number } = req.body;
    //await cardServices.activateCard(cardId);

    res.sendStatus(201);
}