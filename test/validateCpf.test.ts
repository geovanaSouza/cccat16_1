import { validate } from "../src/validateCpf";

test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("Deve testar um cpf válido: %s", function(cpf: any){
    expect(validate(cpf)).toBe(true)
});

test.each([
    undefined,
    null,
    "111111111111",
    "123",
    "123456789123456789",
])("Deve testar um cpf inválido: %s", function(cpf: any){
    expect(validate(cpf)).toBe(false)
});
