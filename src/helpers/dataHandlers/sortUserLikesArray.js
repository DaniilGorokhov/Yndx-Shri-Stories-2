function sortUserLikesArray(array) {
  array.sort((item1, item2) => {
    const value1 = parseFloat(item1.valueText);
    const value2 = parseFloat(item2.valueText);
    // we sort in descending order
    return value2 - value1;
  });
}

module.exports = {
  sortUserLikesArray,
};
