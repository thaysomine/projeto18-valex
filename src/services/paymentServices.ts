import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import * as cardRepository from '../repositories/cardRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';

export async function paymentCard(cardId: number, password: string, businessId: number, value: number) {
    // valor deve ser maior que 0
    if (value <= 0) {
        throw new Error('value must be greater than 0');
    }
    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw new Error('Card not found');
    }
    // passorword deve ser differente de null
    if (card.password === null) {
        throw new Error('Card not activated');
    }
    if (card.isBlocked) {
        throw new Error('Card blocked');
    }
    if (card.expirationDate < dayjs().format('MM/YY')) {
        throw new Error('Card is expired');
    }
    console.log(card.password);
    const isValid = await bcrypt.compare(password, card.password);
    if (!isValid) {
        throw new Error('Wrong password');
    }
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
    console.log(totalBalance);
    // buscar gastos 
    const expenses = await paymentRepository.findByCardId(cardId);
    let totalExpenses = 0;
    if (expenses.length > 0) {
        totalExpenses = expenses.map(item => item.amount).reduce((a, b) => a + b);
    }
    console.log(totalExpenses);
    // verificar se o valor é menor que o saldo
    if (value > totalBalance - totalExpenses) {
        throw new Error('Insufficient balance');
    }
    // persistir transação
    await paymentRepository.insert({
        cardId,
        amount: value,
        businessId
    });
}

//TODO: validação joi