import crypto from "crypto";
import { isCpfValid } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./resource";

var validator = require('validator');

export async function signup(input: any): Promise<any> {
	const account = input;
	account.accountId = crypto.randomUUID();
	const accountExistent = await getAccountByEmail(input.email);
	if (accountExistent) return -4;
	if (!isNameValid(account.name)) return -3;
	if (!isEmailValid(account.email)) return -2;
	if (!isCpfValid(account.cpf)) return -1;
	if (account.isDriver && !isCarPlateValid(account.carPlate)) return -5;
	await saveAccount(account);
	return {
		accountId: account.accountId
	};
};

function isNameValid(name: string) {
	return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isEmailValid(email: string) {
	return email.match(/^(.+)@(.+)$/);
}

function isCarPlateValid(carPlate: string) {
	if (!carPlate) {
		return false;
	}
	return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

export async function getAccount(accountId: string) {
	const account = await getAccountById(accountId);
	if (!account) return -1;
	return account;
}
