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
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(HttpStatusCode.Ok)
});

test("Should create an account to driver", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "ABC1234"
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(HttpStatusCode.Ok)
});

test("Should fail when email is already registered", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
	let output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(HttpStatusCode.Ok)
	output = await axios.post("http://localhost:3000/signup", input)
	expect(output.data).toBe(-4)
	expect(output.status).toBe(HttpStatusCode.UnprocessableEntity)
})

test("Should fail when name is invalid", async function () {
	const input = {
		name: "123User",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
	let output = await axios.post("http://localhost:3000/signup", input);
	expect(output.data).toBe(-3)
	expect(output.status).toBe(HttpStatusCode.UnprocessableEntity)
})

test("Should fail when email is invalid", async function () {
	const input = {
		name: "John Doe",
		email: `invalid_email`,
		cpf: "87748248800",
		isPassenger: true
	}
	let output = await axios.post("http://localhost:3000/signup", input);
	expect(output.data).toBe(-2)
	expect(output.status).toBe(HttpStatusCode.UnprocessableEntity)
})

test("Should fail when cpf is invalid", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "123456789",
		isPassenger: true
	}
	let output = await axios.post("http://localhost:3000/signup", input);
	expect(output.data).toBe(-1)
	expect(output.status).toBe(HttpStatusCode.UnprocessableEntity)
})

test("Should fail when carPlat is invalid", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "invalid_plate"
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.data).toBe(-5)
	expect(output.status).toBe(HttpStatusCode.UnprocessableEntity)
});