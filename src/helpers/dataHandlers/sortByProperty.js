function sortByProperty({
  array,
  propertyForSort,
  descending = false,
}) {
  array.sort((item1, item2) => {
    const value1 = parseFloat(item1[propertyForSort]);
    const value2 = parseFloat(item2[propertyForSort]);

    if (value1 === value2) {
      if (descending) {
        return item1.id - item2.id;
      }
      return item2.id - item1.id;
    }

    if (descending) {
      return value2 - value1;
    }
    return value1 - value2;
  });
}

module.exports = {
  sortByProperty,
};
