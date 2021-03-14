// this function return formatted string by template:
// `${votesQuantity} голос${rightEndOfWord}`
function getVotesText(votesQuantity) {
  // if digit is not there will be zero
  // first when counting by the end
  const firstDigit = votesQuantity % 10;
  const secondDigit = ((votesQuantity % 100) - firstDigit) / 10;
  if (secondDigit === 1) {
    return `${votesQuantity} голосов`;
  }
  if (firstDigit === 1) {
    return `${votesQuantity} голос`;
  }
  if (firstDigit > 1 && firstDigit < 5) {
    return `${votesQuantity} голоса`;
  }
  return `${votesQuantity} голосов`;
}

module.exports = {
  getVotesText,
};
