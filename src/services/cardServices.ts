import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardUtils from "../utils/cardUtils.js";

export async function createCard(employeeId: number, type: cardRepository.TransactionTypes) {
    // validar se o funcionário existe
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) throw new Error("Employee not found");

    const checkCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (checkCard) throw new Error("Card already exists for this employee");
    
    // criar cartão
    const number = faker.finance.creditCardNumber();
    const name = employee.fullName.split(" ");
    let middlename : string = "";
    if (name.length > 1) {
        for (let i = 1; i < name.length-1; i++) {
            if (name[i].length > 3) {
                middlename += name[i][0] + " ";
            } else {
                middlename += name[i] + " ";
            }
        }
    }
    const cardholderName = name[0] + " " + middlename + name[name.length-1];
    const cvvCode = faker.finance.creditCardCVV();
    const cryptr = new Cryptr("myTotallySecretKey");
    const securityCode = cryptr.encrypt(cvvCode);
    const expirationDate = dayjs().add(5, "years").format("MM/YY");

    const card : cardRepository.CardInsertData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type,
    };
    await cardRepository.insert(card);
}

export async function activateCard(cardId: number, securityCode: string, password: string) {
    const card = await cardUtils.checkCard(cardId);
    console.log(card);
    console.log(`cartao ${securityCode}`);
    if (card.password) {
        throw new Error("Card already activated");
    }
    const cryptr = new Cryptr("myTotallySecretKey");
    const decryptedCode = cryptr.decrypt(card.securityCode);
    console.log(`cvv ${decryptedCode}`);
    if (decryptedCode !== securityCode) {
        throw new Error("Wrong security code");
    }
    await cardUtils.checkCardExpiration(cardId);
    const hash = await bcrypt.hash(password, 10);
    await cardRepository.update(cardId, { password: hash });
}

export async function getCardInfos(cardId: number) {
    const card = await cardUtils.checkCard(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);
    const transactions = await paymentRepository.findByCardId(cardId);
    let balance = 0;
    recharges.forEach(recharge => {
        balance += recharge.amount;
    });
    transactions.forEach(transaction => {
        balance -= transaction.amount;
    });

    return { balance, transactions, recharges };
}

export async function blockCard(cardId: number, password: string) {
    await cardUtils.checkCard(cardId);
    await cardUtils.checkCardBlocked(cardId);
    await cardUtils.checkCardExpiration(cardId);
    await cardUtils.checkCardPassword(cardId, password);
    // bloquear cartão
    await cardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
    const card = await cardUtils.checkCard(cardId);
    if (!card.isBlocked) throw new Error("Card already unblocked");
    await cardUtils.checkCardExpiration(cardId);
    await cardUtils.checkCardPassword(cardId, password);
    // desbloquear cartão
    await cardRepository.update(cardId, { isBlocked: false });
}