import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

export async function createCard(employeeId: number, type: cardRepository.TransactionTypes) {
    // validar se o funcionário existe
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
        throw new Error("Employee not found");
    }
    console.log(employee);
    // verificar se o empregado não tem cartão do mesmo tipo
    const checkCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (checkCard) {
        throw new Error("Card already exists for this employee");
    }
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
    console.log(`dados do cartao ${card}`);
    await cardRepository.insert(card);
}

export async function activateCard(cardId: number, securityCode: string, password: string) {
    // validar se o cartão existe
    const card = await cardRepository.findById(cardId);
    console.log(card);
    console.log(`cartao ${securityCode}`);
    if (!card) {
        throw new Error("Card not found");
    }
    // validar se ja foi ativado
    if (card.password) {
        throw new Error("Card already activated");
    }
    // validar se o cvv está correto
    const cryptr = new Cryptr("myTotallySecretKey");
    const decryptedCode = cryptr.decrypt(card.securityCode);
    console.log(`cvv ${decryptedCode}`);
    if (decryptedCode !== securityCode) {
        throw new Error("Wrong security code");
    }

    //Somente cartões não expirados devem ser ativados
    const expirationDate = card.expirationDate;
    console.log(`data de expiracao ${expirationDate}`);
    if (expirationDate < dayjs().format("MM/YY")) {
        throw new Error("Card expired");
    } 
    // atribui a senha ao cartão
    const hash = await bcrypt.hash(password, 10);
    await cardRepository.update(cardId, { password: hash });
}

export async function getCardInfos(cardId: number) {
    // validar se o cartão existe
    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw new Error("Card not found");
    }
    // TODO: get card infos
    // retornar as informações do cartão no formato {
    //   "balance": 35000,
    //   "transactions": [
    // 		{ "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
    // 	]
    //   "recharges": [
    // 		{ "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
    // 	]
    // }

    //O saldo de um cartão equivale a soma de suas recargas menos a soma de suas compras
    return card;
}

export async function blockCard(cardId: number, password: string) {
    // validar se o cartão existe
    const card = await cardRepository.findById(cardId);
    // validar se o cartão existe
    if (!card) {
        throw new Error("Card not found");
    }
    // validar se o cartão já está bloqueado
    if (card.isBlocked) {
        throw new Error("Card already blocked");
    }
    // validar se a senha está correta
    const comparePassword = await bcrypt.compare(password, card.password);
    console.log(comparePassword);
    if (!comparePassword) {
    throw new Error("Wrong password"); 
    }
    // bloquear cartão
    await cardRepository.update(cardId, { isBlocked: true });
}