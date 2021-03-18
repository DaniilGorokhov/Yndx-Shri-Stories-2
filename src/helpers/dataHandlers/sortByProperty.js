function sortByProperty({
  array,
  propertyForSort,
  descending = false,
  uniqueSortMap = null,
}) {
  array.sort((item1, item2) => {
    const value1 = parseFloat(item1[propertyForSort]);
    const value2 = parseFloat(item2[propertyForSort]);

    if (value1 === value2 && uniqueSortMap) {
      if (descending) {
        return uniqueSortMap.get(item1.id) - uniqueSortMap.get(item2.id);
      }
      return uniqueSortMap.get(item2.id) - uniqueSortMap.get(item1.id);
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
