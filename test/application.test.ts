import { GetAccount, Signup } from "../src/application";
import { AccountDAODatabase } from "../src/resource";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(async () => {
	const accountDAO = new AccountDAODatabase();
	signup = new Signup(accountDAO);
	getAccount = new GetAccount(accountDAO);
})

test("Should create an account to passenger", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const expectedAccount = {
		account_id: outputSignup.accountId,
		car_plate: null,
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		is_passenger: input.isPassenger,
		is_driver: false
	};
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount).toStrictEqual(expectedAccount)
});

test("Should create an account to driver", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "ABC1234"
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const expectedAccount = {
		account_id: outputSignup.accountId,
		car_plate: input.carPlate,
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		is_passenger: false,
		is_driver: input.isDriver
	};
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount).toStrictEqual(expectedAccount)
});

test("Should fail in create account when email is already registered", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
	await signup.execute(input);
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
})

test("Should fail in create account when name is invalid", async function () {
	const input = {
		name: "123User",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
})

test("Should fail in create account when email is invalid", async function () {
	const input = {
		name: "John Doe",
		email: `invalid_email`,
		cpf: "87748248800",
		isPassenger: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
})

test("Should fail in create account when cpf is invalid", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "123456789",
		isPassenger: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
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
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
})

test("Should fail in get account when id is not found", async function () {
	const id = "018ebfa8-4a72-7f0d-9df6-ed774448a63c";
	const outputGetAccount = await getAccount.execute(id);
	expect(outputGetAccount).toBe(-1)
});