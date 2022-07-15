import { Request, Response, NextFunction } from "express";

export default function errorHandler (error, req: Request, res: Response, next: NextFunction) {
    console.log(error)
	if (error.message) {
		return res.status(400).send(error.message);
	}
	return res.sendStatus(500);
}