import crypto from "crypto";
import { isParameter } from "typescript"
import { AccountDAODatabase } from "../src/resource";

test("Should save a record on account table and query by ID", async function () {
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: `john.doe${Math.random}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true
    }
    const accountDAO = new AccountDAODatabase();
    await accountDAO.saveAccount(account);
    const accountById = await accountDAO.getAccountById(account.accountId);
    expect(accountById.account_id).toBe(account.accountId);
    expect(accountById.name).toBe(account.name);
    expect(accountById.email).toBe(account.email);
    expect(accountById.cpf).toBe(account.cpf);
    expect(accountById.is_passenger).toBe(account.isPassenger)
});

test("Should save a record ona ccount table and query by email", async function () {
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true
    }
    const accountDAO = new AccountDAODatabase();
    await accountDAO.saveAccount(account);
    const accountByEmail = await accountDAO.getAccountByEmail(account.email);
    expect(accountByEmail.account_id).toBe(account.accountId);
    expect(accountByEmail.name).toBe(account.name);
    expect(accountByEmail.email).toBe(account.email);
    expect(accountByEmail.cpf).toBe(account.cpf);
    expect(accountByEmail.is_passenger).toBe(account.isPassenger);
})