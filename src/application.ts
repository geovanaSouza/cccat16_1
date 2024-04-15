import crypto from "crypto";
import pgp from "pg-promise";
import { isCpfValid } from "./validateCpf";

var validator = require('validator');

export async function signup(input: any): Promise<any> {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const [accountExistent] = await connection.query("select * from cccat16.account where email = $1", [input.email]);
		if (accountExistent) return -4;
		if (!isNameValid(input.name)) return -3;
		if (!isEmailValid(input.email)) return -2;
		if (!isCpfValid(input.cpf)) return -1;
		if (input.isDriver && !isCarPlateValid(input.carPlate)) return -5;
		const accountID = crypto.randomUUID();
		await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [accountID, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
		const accountCreated = {
			accountId: accountID
		};
		return accountCreated;
	} finally {
		await connection.$pool.end();
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
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const [account] = await connection.query("select * from cccat16.account where account_id = $1", [accountId]);
		if (!account) return -1;
		return account;
	} finally {
		await connection.$pool.end();
	};

}
