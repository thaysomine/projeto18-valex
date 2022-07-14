import { NextFunction, Request, Response } from "express";

import * as companyRepository from "../repositories/companyRepository.js";

export async function validateKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) throw new Error("API key is required");

    const companyInfo = await companyRepository.findByApiKey(apiKey)
    if (!companyInfo) throw new Error("Invalid API key");

    next();
}