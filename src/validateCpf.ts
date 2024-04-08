export function validate(cpf: string) {
    if (cpf === null) return false;
    if (cpf === undefined) return false;
    const cleanedCpf = cleanCpf(cpf);
    if (!isValidLength(cleanedCpf)) return false;
    if (allDigitsEqual(cleanedCpf)) return false;
    let nDigVerific = extractDigit(cleanedCpf);
    return nDigVerific == getDigits(cleanedCpf);
}

function cleanCpf(cpf: string) {
    return cpf.replace(/\D/g, "");
}

function isValidLength(cpf: string) {
    return cpf.length === 11;
}

function allDigitsEqual(cpf: string) {
    return (cpf.split("").every(c => c === cpf[0]))
}

function extractDigit(cpf: string){
    return cpf.slice(9);
}

function getDigits(cpf: string){
    const dg1 = calculateDigit(cpf, 10);
    const dg2 = calculateDigit(cpf, 11);
    return `${dg1}${dg2}`
}

function calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf){
        if (factor > 1) total += parseInt(digit) * factor --;
    }
    const rest = total%11;
    return (rest < 2) ? 0 : 11 - rest;
}
