import express from "express";
import { HttpStatusCode } from "axios";
import { AccountDAODatabase } from "./resource";
import { GetAccount, Signup } from "./application";
const app = express();
app.use(express.json());

var validator = require('validator');

app.post("/signup", async function (req, res) {
	try {
		const accountDAO = new AccountDAODatabase();
		const signup = new Signup(accountDAO);
		const output = await signup.execute(req.body);
		res.json(output);
	} catch (error: any) {
		res.status(HttpStatusCode.BadRequest).json({
			message: error.message
		});
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	if (validator.isUUID(req.params.accountId) !== true) return res.status(HttpStatusCode.BadRequest).send(-2 + "");
	const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO);
	const output = await getAccount.execute(req.params.accountId);
	if (typeof output == "number" && output === -1){
		return res.status(HttpStatusCode.NotFound).send(output + "");
	}
	res.json(output);
});

app.listen(3000);