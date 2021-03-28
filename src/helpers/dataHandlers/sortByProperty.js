function sortByProperty({
  array,
  propertyForSort,
  descending = false,
  withParse = true,
}) {
  array.sort((item1, item2) => {
    let value1;
    let value2;
    if (withParse) {
      value1 = parseFloat(item1[propertyForSort]);
      value2 = parseFloat(item2[propertyForSort]);
    } else {
      value1 = item1[propertyForSort];
      value2 = item2[propertyForSort];
    }

    if (value1 === value2) {
      if (descending) {
        return item1.id - item2.id;
      }
      return item2.id - item1.id;
    }

    if (withParse) {
      if (descending) {
        return value2 - value1;
      }
      return value1 - value2;
    }
    if (descending) {
      // convert true into 1 and false into -1
      return 2 * (value1 > value2) - 1;
    }
    // convert true into 1 and false into -1
    return 2 * (value1 > value2) - 1;
  });
}

module.exports = {
  sortByProperty,
};
