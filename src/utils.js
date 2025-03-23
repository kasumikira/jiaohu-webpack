export const sleep = ms => new Promise(r => setTimeout(r, ms));

export function isLetter(ch) {
    return /^[a-zA-Z]$/.test(ch);
}

export function isDigit(ch) {
    return /^[0-9]$/.test(ch);
}
