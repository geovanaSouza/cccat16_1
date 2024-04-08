export function validate(str: string) {
    if (str === null) return false;
    if (str === undefined) return false;
    if (!isCpfLenValid(str)) return false;
    str = cleanCpf(str);
    if (isCpfDigitValid(str)) return false;

    try {
        let d1, d2;
        let dg1, dg2, rest;
        let digito;
        let nDigResult;
        d1 = d2 = 0;
        dg1 = dg2 = rest = 0;
        for (let nCount = 1; nCount < str.length - 1; nCount++) {
            digito = parseInt(str.substring(nCount - 1, nCount));
            d1 = d1 + (11 - nCount) * digito;
            d2 = d2 + (12 - nCount) * digito;
        };
        rest = (d1 % 11);
        // se for menor que 2 é 0, senão é 11 menos o resto
        dg1 = (rest < 2) ? dg1 = 0 : 11 - rest;
        d2 += 2 * dg1;
        rest = (d2 % 11);
        if (rest < 2)
            dg2 = 0;
        else
            dg2 = 11 - rest;

        let nDigVerific = str.substring(str.length - 2, str.length);
        nDigResult = "" + dg1 + "" + dg2;
        return nDigVerific == nDigResult;
        // se der problema...
    } catch (e) {
        console.error("Erro !" + e)
        return false
    }
}

function isCpfLenValid(cpf: string) {
    return cpf.length >= 11 && cpf.length <= 14
}

function cleanCpf(cpf: string) {
    return cpf
        .replace('.', '')
        .replace('.', '')
        .replace('-', '')
        .replace(" ", "");
}

function isCpfDigitValid(cpf: string) {
    return (cpf.split("").every(c => c === cpf[0]))
}
