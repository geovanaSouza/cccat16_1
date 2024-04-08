const CPF_LENGTH = 11;
const FACTOR_FIRST_DIGIT = 10;
const FACTOR_SECOND_DIGIT = 11;

export function validate(rawCpf: string) {
    if (!rawCpf) return false;
    const cleanedCpf = removeNonDigits(rawCpf);
    if (!isValidLength(cleanedCpf)) return false;
    if (allDigitsEqual(cleanedCpf)) return false;
    return extractDigit(cleanedCpf) === calculateAllDigits(cleanedCpf);
}

function removeNonDigits(cpf: string) {
    return cpf.replace(/\D/g, "");
}

function isValidLength(cpf: string) {
    return cpf.length === CPF_LENGTH;
}

function allDigitsEqual(cpf: string) {
    const [firstDigit] = cpf;
    return (cpf.split("").every(digit => digit === firstDigit))
}

function extractDigit(cpf: string){
    return cpf.slice(9);
}

function calculateAllDigits(cpf: string){
    const digit1 = calculateSingleDigit(cpf, FACTOR_FIRST_DIGIT);
    const digit2 = calculateSingleDigit(cpf, FACTOR_SECOND_DIGIT);
    return `${digit1}${digit2}`
}

function calculateSingleDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf){
        if (factor > 1) total += parseInt(digit) * factor --;
    }
    const rest = total%11;
    return (rest < 2) ? 0 : 11 - rest;
}
