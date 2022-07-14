import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import * as cardRepository from '../repositories/cardRepository.js';

// validar se cartão existe
export async function checkCard(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");

    return card;
}

// validar se cartao expirou
export async function checkCardExpiration(cardId: number) {
    const card = await checkCard(cardId);
    const expirationDate = card.expirationDate;
    console.log(`data de expiracao ${expirationDate}`);
    if (expirationDate < dayjs().format("MM/YY")) throw new Error("Card expired");
}

// validar se cartão está bloqueado
export async function checkCardBlocked(cardId: number) {
    const card = await checkCard(cardId);
    if (card.isBlocked) throw new Error("Card already blocked");
}

// validar se senha está correta
export async function checkCardPassword(cardId: number, password: string) {
    const card = await checkCard(cardId);
    const comparePassword = await bcrypt.compare(password, card.password);
    if (!comparePassword) throw new Error("Wrong password"); 
}