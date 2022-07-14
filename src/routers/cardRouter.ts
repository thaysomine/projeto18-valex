import {Router} from 'express';

import { createCard, activateCard, blockCard, unblockCard, getCardInfos } from '../controllers/cardController.js';
import { validateKey } from '../middlewares/validateKey.js';
import { validateCreateCard } from '../middlewares/validateData.js';

const cardRouter = Router();

cardRouter.post('/card/create', validateKey, validateCreateCard, createCard);
cardRouter.post('/card/activate/:id', activateCard);
cardRouter.get('/card/:id', getCardInfos);
cardRouter.post('/card/block/:id', blockCard);
cardRouter.post('/card/unblock/:id', unblockCard);

export default cardRouter;