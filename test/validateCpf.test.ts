import { validate } from "../src/validateCpf";

test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("Deve testar um cpf válido: %s", function(cpf: any){
    const isValid = validate(cpf);
    expect(isValid).toBe(true)
})
