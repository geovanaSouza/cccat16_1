import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { isCpfValid } from "./validateCpf";
import { HttpStatusCode } from "axios";
const app = express();
app.use(express.json());

var validator = require('validator');

app.post("/signup", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [accountExistent] = await connection.query("select * from cccat16.account where email = $1", [req.body.email]);
	let result;
	if (accountExistent) result = -4;
	if (!isNameValid(req.body.name)) result = -3;
	if (!isEmailValid(req.body.email)) result = -2;
	if (!isCpfValid(req.body.cpf)) result = -1;
	if (req.body.isDriver && !isCarPlateValid(req.body.carPlate)) result = -5;
	const accountID = crypto.randomUUID();
	await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [accountID, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);
	if (typeof result === "number"){
		res.status(HttpStatusCode.BadRequest).send(result + "");
	} else {
		const accountCreated = {
			accountId: accountID
		};
		res.json(accountCreated);
	}
	await connection.$pool.end();
	
});

function isNameValid(name: string) {
	return name.match(/[a-zA-Z] [a-zA-Z]+/)
}

function isEmailValid(email: string) {
	return email.match(/^(.+)@(.+)$/)
}

function isCarPlateValid(carPlate: string) {
	if (!carPlate) {
		return false
	}
	return carPlate.match(/[A-Z]{3}[0-9]{4}/)
}

app.get("/accounts/:accountId", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	if (validator.isUUID(req.params.accountId) !== true) return res.status(HttpStatusCode.BadRequest).send(-2 + "");
	const [account] = await connection.query("select * from cccat16.account where account_id = $1", [req.params.accountId]);
	if (!account) return res.status(HttpStatusCode.NotFound).send(-1 + "");
	await connection.$pool.end();
	res.json(account);
});

app.listen(3000);