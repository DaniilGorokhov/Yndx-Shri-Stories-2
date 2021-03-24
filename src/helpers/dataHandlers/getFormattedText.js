// this function return formatted string by template:
// `${votesQuantity} ${word}${rightEndOfWord}`.
// valueHandler is function for handling value, that handle after compute rightEndOfWord
function getFormattedText(value, word, endsOfWord, { valueHandler = null } = {}) {
  // if there is not digit, it will be zero
  // first -> when counting by the end
  const firstDigit = Math.abs(value) % 10;
  const secondDigit = ((Math.abs(value) % 100) - firstDigit) / 10;

  let preparedValue;
  if (valueHandler) {
    preparedValue = valueHandler(value);
  } else {
    preparedValue = value;
  }

  // case when we have numbers, that module of 100 (% 100) is in range from 10 to 19
  if (secondDigit === 1) {
    return `${preparedValue} ${word}${endsOfWord.other}`;
  }
  // other cases
  if (firstDigit === 1) {
    return `${preparedValue} ${word}${endsOfWord.one}`;
  }
  if (firstDigit > 1 && firstDigit < 5) {
    return `${preparedValue} ${word}${endsOfWord.twoFive}`;
  }
  return `${preparedValue} ${word}${endsOfWord.other}`;
}

module.exports = {
  getFormattedText,
};
