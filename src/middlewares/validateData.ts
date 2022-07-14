import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as cardRepository from '../repositories/cardRepository.js';

export async function validateCreateCard(req: Request, res: Response, next: NextFunction) {
    const { employeeId, type }: { employeeId: number, type: cardRepository.TransactionTypes } = req.body;
    const schema = joi.object().keys({
        employeeId: joi.number().required(),
        type: joi.string().required()
    });
    const result = schema.validate({ employeeId, type });
    if (result.error) throw new Error(result.error.message);

    next();
}

export async function validateActivateCard(req: Request, res: Response, next: NextFunction) {
    const { securityCode, password }: { securityCode: string, password: string } = req.body;
    const schema = joi.object().keys({
        securityCode: joi.string().required(),
        password: joi.string().regex(/^[0-9]{4}$/).required()
    });
    const result = schema.validate({ securityCode, password });
    if (result.error) throw new Error(result.error.message);

    next();
}
