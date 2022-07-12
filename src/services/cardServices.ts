import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";

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

export async function activateCard(cardId: number, password: string, securityCode: string) {
    // validar se o cartão existe
    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw new Error("Card not found");
    }
    // validar se a senha está correta
    const cryptr = new Cryptr("myTotallySecretKey");
    const decryptedCode = cryptr.decrypt(card.securityCode);
    if (decryptedCode !== password) {
        throw new Error("Wrong password");
    }
    // ativar cartão
    await cardRepository.activateCard(cardId);
}
