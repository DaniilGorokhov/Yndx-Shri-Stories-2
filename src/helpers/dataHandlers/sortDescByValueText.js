function sortDescByValueText(array) {
  array.sort((item1, item2) => {
    const value1 = parseFloat(item1.valueText);
    const value2 = parseFloat(item2.valueText);
    // we sort in descending order
    if (value2 !== value1) {
      return value2 - value1;
    }
    // if items have same valueText, than first will be user, which id is less
    return item1.id - item2.id;
  });
}

module.exports = {
  sortDescByValueText,
};
