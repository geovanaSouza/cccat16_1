import crypto from "crypto";
import { isCpfValid } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./resource";

var validator = require('validator');

export async function signup(input: any): Promise<any> {
	const account = input;
	account.accountId = crypto.randomUUID();
	const accountExistent = await getAccountByEmail(input.email);
	if (accountExistent) throw new Error("Account already exists");
	if (!isNameValid(account.name)) throw new Error("Invalid name");
	if (!isEmailValid(account.email)) throw new Error("Invalid email");
	if (!isCpfValid(account.cpf)) throw new Error("Invalid cpf");
	if (account.isDriver && !isCarPlateValid(account.carPlate)) throw new Error("Invalid car plate");
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
