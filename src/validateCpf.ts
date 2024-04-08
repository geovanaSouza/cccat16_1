export function validate(cpf: string) {
    if (cpf === null) return false;
    if (cpf === undefined) return false;
    let cleanedCpf;
    cleanedCpf = cleanCpf(cpf);
    if (!isValidLength(cleanedCpf)) return false;
    if (allDigitsEqual(cleanedCpf)) return false;
    let d1, d2;
    d1 = d2 = 0;
    for (let nCount = 1; nCount < cleanedCpf.length - 1; nCount++) {
        let digito;
        digito = parseInt(cleanedCpf.substring(nCount - 1, nCount));
        d1 = getD(d1, 11, nCount, digito)
        d2 = getD(d2, 12, nCount, digito)
    };
    let nDigVerific = cleanedCpf.substring(cleanedCpf.length - 2, cleanedCpf.length);
    return nDigVerific == getDigit(d1, d2);

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

function getDigit(d1: number, d2: number) {
    let rest
    rest = (d1 % 11);
    let dg1
    dg1 = (rest < 2) ? dg1 = 0 : 11 - rest;
    d2 += 2 * dg1;
    rest = (d2 % 11);
    let dg2;
    dg2 = (rest < 2) ? 0 : (11 - rest);
    return "" + dg1 + "" + dg2;
}
