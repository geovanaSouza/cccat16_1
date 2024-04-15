import express from "express";
import { HttpStatusCode } from "axios";
import { getAccount, signup } from "./application";
const app = express();
app.use(express.json());

var validator = require('validator');

app.post("/signup", async function (req, res) {
	const output = await signup(req.body);
	if (typeof output === "number"){
		res.status(HttpStatusCode.BadRequest).send(output + "");
	} else {
		res.json(output);
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