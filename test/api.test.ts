import axios, { HttpStatusCode } from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Should create an account to passenger", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(HttpStatusCode.Ok);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	const expectedAccount = {
		account_id: responseSignup.data.accountId,
		car_plate: null,
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		is_passenger: input.isPassenger,
		is_driver: false
	};
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	expect(responseGetAccount.data).toStrictEqual(expectedAccount);
});

test("Should create an account to driver", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "ABC1234"
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(HttpStatusCode.Ok);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	const expectedAccount = {
		account_id: responseSignup.data.accountId,
		car_plate: input.carPlate,
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		is_passenger: false,
		is_driver: input.isDriver
	};
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	expect(responseGetAccount.data).toStrictEqual(expectedAccount);
});

test("Should fail in create account when email is already registered", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await axios.post("http://localhost:3000/signup", input);
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(HttpStatusCode.BadRequest);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe("Account already exists");
})

test("Should fail in create account when name is invalid", async function () {
	const input = {
		name: "123User",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(HttpStatusCode.BadRequest);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe("Invalid name");
})

test("Should fail in create account when email is invalid", async function () {
	const input = {
		name: "John Doe",
		email: `invalid_email`,
		cpf: "87748248800",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(HttpStatusCode.BadRequest);
	const outputSignup = responseSignup.data;
	expect (outputSignup.message).toBe("Invalid email"); 
})

test("Should fail in create account when cpf is invalid", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "123456789",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(HttpStatusCode.BadRequest);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe("Invalid cpf");
})

test.each([
	"invalid_plate",
	undefined,
	null
])("Should fail in create driver account when carPlate is invalid: %s", async function (carPlate :any) {
	const input = {
		name: "John Doe",
		email: `jonh.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: carPlate
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(HttpStatusCode.BadRequest);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe("Invalid car plate");
})

test("Should fail in get account when id is invalid", async function () {
	const id = "123456";
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${id}`);
	expect(responseGetAccount.data).toBe(-2);
	expect(responseGetAccount.status).toBe(HttpStatusCode.BadRequest);
});

test("Should fail in get account when id is not found", async function () {
	const id = "018ebfa8-4a72-7f0d-9df6-ed774448a63c";
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${id}`);
	expect(responseGetAccount.data).toBe(-1)
	expect(responseGetAccount.status).toBe(HttpStatusCode.NotFound)
});