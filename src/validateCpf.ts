export function validate(cpf: string) {
    if (cpf === null) return false;
    if (cpf === undefined) return false;
    const cleanedCpf = cleanCpf(cpf);
    if (!isValidLength(cleanedCpf)) return false;
    if (allDigitsEqual(cleanedCpf)) return false;

    let d1 = 0;
    let d2 = 0;
    for (let nCount = 1; nCount < cleanedCpf.length - 1; nCount++) {
        const digito = parseInt(cleanedCpf.substring(nCount - 1, nCount));
        d1 = getD(d1, 11, nCount, digito)
        d2 = getD(d2, 12, nCount, digito)
    };

    let nDigVerific = extractDigit(cleanedCpf);
    return nDigVerific == getDigitResult(d1, d2);

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

function getD(d: number, factor: number, count: number, digito: number) {
    return d + (factor - count) * digito;
}

function extractDigit(cpf: string){
    return cpf.slice(9);
}

function getDigitResult(d1: number, d2: number) {
    let dg1 = getDigit(d1)
    d2 += 2 * dg1;
    let dg2 = getDigit(d2)
    return `${dg1}${dg2}`
}

function getDigit(total: number){
    const rest = total%11;
    return (rest < 2) ? 0 : 11 - rest;
}
