import { validate } from "../src/validateCpf";

test("Deve testar um cpf válido", function(){
    // given - arrange
    const cpf = "97456321558";
    // when - act
    const isValid = validate(cpf);
    // then - assert
    expect(isValid).toBe(true)
})

test("Deve testar um cpf válido", function(){
    // given - arrange
    const cpf = "71428793860";
    // when - act
    const isValid = validate(cpf);
    // then - assert
    expect(isValid).toBe(true);
})

test("Deve testar um cpf válido", function(){
    // given - arrange
    const cpf = "87748248800";
    // when - act
    const isValid = validate(cpf);
    // then - assert
    expect(isValid).toBe(true)
})
