const CPF_LENGTH = 11;

export function validate(cpf: string) {
    if (!cpf) return false;
    const cleanedCpf = cleanCpf(cpf);
    if (!isValidLength(cleanedCpf)) return false;
    if (allDigitsEqual(cleanedCpf)) return false;
    return extractDigit(cleanedCpf) === calculateAllDigits(cleanedCpf);
}

function cleanCpf(cpf: string) {
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
    const digit1 = calculateSingleDigit(cpf, 10);
    const digit2 = calculateSingleDigit(cpf, 11);
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
