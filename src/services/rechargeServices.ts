import dayjs from "dayjs";

import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function rechargeCard (cardId: number, value: number) {
//   validar valor maior que 0
    if (value <= 0) {
        throw new Error('value must be greater than 0');
    }
    const card = await cardRepository.findById(cardId);
    if (!card) {
    throw new Error('Card not found');
    }
    if (card.isBlocked) {
        throw new Error('Card is blocked');
    }
    if (card.expirationDate < dayjs().format('MM/YY')) {
        throw new Error('Card is expired');
    }
    const transaction : rechargeRepository.RechargeInsertData = {
        cardId,
        amount: value
    }
    await rechargeRepository.insert(transaction);
}

// **Regras de negócio:**

// - Somente cartões cadastrados devem receber recargas
// - Somente cartões ativos devem receber recargas
// - Somente cartões não expirados devem receber recargas
// - A recarga deve ser persistida