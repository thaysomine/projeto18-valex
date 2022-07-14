import dayjs from "dayjs";

import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as cardUtils from "../utils/cardUtils.js";

export async function rechargeCard (cardId: number, value: number) {
    if (value <= 0) {
        throw new Error('value must be greater than 0');
    }
    const card = await cardUtils.checkCard(cardId);
    await cardUtils.checkCardBlocked(cardId);
    await cardUtils.checkCardExpiration(cardId);
    const transaction : rechargeRepository.RechargeInsertData = {
        cardId,
        amount: value
    }
    await rechargeRepository.insert(transaction);
}