const getChallengeStatus = (creatorResult, joinerResult) => {
    const clearCases = [
        { creator: "Win", joiner: "Lose" },
        { creator: "Lose", joiner: "Win" }
    ];

    const isClear = clearCases.some(
        (caseResult) =>
            caseResult.creator === creatorResult && caseResult.joiner === joinerResult
    );

    return isClear ? "Clear" : "Review";
}

const hasPendingResults = (lastChallenge, userId) => {
    if (lastChallenge) {
        if (lastChallenge.creator == userId) {
            return lastChallenge.creator_result == "Waiting";
        } else {
            return lastChallenge.joiner_result == "Waiting";
        }
    }
    return false;
};

module.exports = { getChallengeStatus, hasPendingResults };