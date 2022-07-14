import * as cardRepository from '../repositories/cardRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import* as cardUtils from '../utils/cardUtils.js';

export async function paymentCard(cardId: number, password: string, businessId: number, value: number) {
    if (value <= 0) {
        throw new Error('value must be greater than 0');
    }
    const card = await cardUtils.checkCard(cardId);
    if (card.password === null) {
        throw new Error('Card not activated');
    }
    await cardUtils.checkCardBlocked(cardId);
    await cardUtils.checkCardExpiration(cardId);
    await cardUtils.checkCardPassword(cardId, password);
    const business = await businessRepository.findById(businessId);
    if (!business) {
        throw new Error('Business not found');
    }
    // comparar tipo do cartão business com o tipo do cartão do cliente
    if (card.type !== business.type) {
        throw new Error('Invalid card type');
    }
    // verificar saldo do cartao
    const balance = await rechargeRepository.findByCardId(cardId);
    if (balance.length === 0) {
        throw new Error('Card has no balance');
    }
    const totalBalance = balance.map(item => item.amount).reduce((a, b) => a + b);
    // buscar gastos 
    const expenses = await paymentRepository.findByCardId(cardId);
    let totalExpenses = 0;
    if (expenses.length > 0) {
        totalExpenses = expenses.map(item => item.amount).reduce((a, b) => a + b);
    }
    // verificar se o valor é menor que o saldo
    if (value > totalBalance - totalExpenses) throw new Error('Insufficient balance');
    
    await paymentRepository.insert({
        cardId,
        amount: value,
        businessId
    });
}