function generateInviteCode() {
    const getInviteUpperCaseLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);

    const getInviteDigit = () => Math.floor(Math.random() * 10);

    const firstTwoLetters = getInviteUpperCaseLetter() + getInviteUpperCaseLetter();
    const fourDigits = Array.from({ length: 4 }, getInviteDigit).join('');

    return firstTwoLetters + fourDigits;
}

module.exports = { generateInviteCode };