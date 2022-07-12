import {Router} from 'express';

import { createCard } from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/card/create', createCard);

export default cardRouter;