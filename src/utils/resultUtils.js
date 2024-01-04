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

module.exports = { getChallengeStatus };