function generateInviteCode() {
    const getInviteUpperCaseLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);

    const getInviteDigit = () => Math.floor(Math.random() * 10);

    const firstTwoLetters = getInviteUpperCaseLetter() + getInviteUpperCaseLetter();
    const fourDigits = Array.from({ length: 4 }, getInviteDigit).join('');

    return firstTwoLetters + fourDigits;
}

function calculateCoinDeductions(gameCoin, winCoin, referCoin, coinRequired) {
    let remainingCoinRequired = coinRequired;
    let gameCoinDeduction = 0;
    let winCoinDeduction = 0;
    let referCoinDeduction = 0;

    // Deduct from game_coin
    if (gameCoin >= remainingCoinRequired) {
        gameCoinDeduction = remainingCoinRequired;
        remainingCoinRequired = 0;
    } else {
        gameCoinDeduction = gameCoin;
        remainingCoinRequired -= gameCoin;
    }

    // Deduct from win_coin if necessary
    if (remainingCoinRequired > 0 && winCoin >= remainingCoinRequired) {
        winCoinDeduction = remainingCoinRequired;
        remainingCoinRequired = 0;
    } else if (remainingCoinRequired > 0) {
        winCoinDeduction = winCoin;
        remainingCoinRequired -= winCoin;
    }

    // Deduct from refer_coin if necessary
    if (remainingCoinRequired > 0 && referCoin >= remainingCoinRequired) {
        referCoinDeduction = remainingCoinRequired;
        remainingCoinRequired = 0;
    } else if (remainingCoinRequired > 0) {
        referCoinDeduction = referCoin;
        remainingCoinRequired -= referCoin;
    }

    return {
        gameCoinDeduction,
        winCoinDeduction,
        referCoinDeduction,
        remainingCoinRequired,
    };
}

module.exports = { generateInviteCode, calculateCoinDeductions };