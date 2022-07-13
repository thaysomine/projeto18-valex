import {Router} from 'express';

import { createCard, activateCard, blockCard } from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/card/create', createCard);
cardRouter.post('/card/activate/:id', activateCard);
cardRouter.post('/card/block/:id', blockCard);

export default cardRouter;