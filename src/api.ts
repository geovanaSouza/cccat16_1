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
	try {
		const [accountExistent] = await connection.query("select * from cccat16.account where email = $1", [req.body.email]);
		if (accountExistent) return res.status(HttpStatusCode.BadRequest).send(-4 + "");
		if (!isNameValid(req.body.name)) return res.status(HttpStatusCode.BadRequest).send(-3 + "");
		if (!isEmailValid(req.body.email)) return res.status(HttpStatusCode.BadRequest).send(-2 + "");
		if (!isCpfValid(req.body.cpf)) return res.status(HttpStatusCode.BadRequest).send(-1 + "");
		if ((req.body.isDriver) && (!isPlateValid(req.body.carPlate))) return res.status(HttpStatusCode.BadRequest).send(-5 + "");
		const accountID = crypto.randomUUID();
		await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [accountID, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);
		const accountCreated = {
			accountId: accountID
		};
		res.json(accountCreated);
	} finally {
		await connection.$pool.end();
	}
});

function isNameValid (name: string) {
	return name.match(/[a-zA-Z] [a-zA-Z]+/)
}

function isEmailValid(email: string){
	return email.match(/^(.+)@(.+)$/)
}

function isPlateValid(plate :string){
	return plate.match(/[A-Z]{3}[0-9]{4}/)
}

app.get("/accounts/:uid", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		if (validator.isUUID(req.params.uid) !== true) return res.status(HttpStatusCode.BadRequest).send(-2 + "");
		const [account] = await connection.query("select * from cccat16.account where account_id = $1", [req.params.uid]);
		if (!account) return res.status(HttpStatusCode.NotFound).send(-1 + "");
		res.json(account);
	} finally {
		await connection.$pool.end();
	}
});

app.listen(3000);