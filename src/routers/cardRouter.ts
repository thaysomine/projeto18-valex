import {Router} from 'express';

import { createCard, activateCard, blockCard, unblockCard } from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/card/create', createCard);
cardRouter.post('/card/activate/:id', activateCard);
// TODO: rota para pegar os dados do cartão
cardRouter.post('/card/block/:id', blockCard);
cardRouter.post('/card/unblock/:id', unblockCard);

export default cardRouter;