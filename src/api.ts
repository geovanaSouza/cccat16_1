import express from "express";
import { HttpStatusCode } from "axios";
import { getAccount, signup } from "./application";
const app = express();
app.use(express.json());

var validator = require('validator');

app.post("/signup", async function (req, res) {
	try {
		const output = await signup(req.body);
		res.json(output);
	} catch (error: any) {
		res.status(HttpStatusCode.BadRequest).json({
			message: error.message
		});
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	if (validator.isUUID(req.params.accountId) !== true) return res.status(HttpStatusCode.BadRequest).send(-2 + "");
	const output = await getAccount(req.params.accountId);
	if (typeof output == "number" && output === -1){
		return res.status(HttpStatusCode.NotFound).send(output + "");
	}
	res.json(output);
});

app.listen(3000);