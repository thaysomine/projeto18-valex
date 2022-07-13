import { Request, Response } from 'express';
import * as cardServices from '../services/cardServices.js';
import * as cardRepository from '../repositories/cardRepository.js';

export async function createCard(req: Request, res: Response) {
    const { employeeId, type } : { employeeId : number, type: cardRepository.TransactionTypes } = req.body;
    // TODO: validar dados (joi)
    await cardServices.createCard(employeeId, type);
    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const { id } = req.params;
    const { securityCode, password }: { securityCode: string; password: string } = req.body;
    // TODO: A senha do cartão deverá ser composta de 4 números
    const cardId = parseInt(id);

    await cardServices.activateCard(cardId, securityCode, password);
    res.sendStatus(201);
}

export async function getCardInfos (req: Request, res: Response) {
    const { id } = req.params;
    const cardId = parseInt(id);

    const card = await cardServices.getCardInfos(cardId);
    res.json(card);
}

export async function blockCard (req: Request, res: Response) {
    const { id } = req.params;
    const cardId = parseInt(id);
    const { password } : {password: string} = req.body;

    await cardServices.blockCard(cardId, password);
    res.sendStatus(201);
}

export async function unblockCard (req: Request, res: Response) {
    const { id } = req.params;
    const cardId = parseInt(id);
    const { password } : {password: string} = req.body;

    await cardServices.unblockCard(cardId, password);
    res.sendStatus(201);
}