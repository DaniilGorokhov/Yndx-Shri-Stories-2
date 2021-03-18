// TODO description for each function
// return index of arrayItem, which is closest to value on the left side.
// if there is not for value arrayItem on the left side, return -1.
function binarySearchStartByProperty({
  // array where we will search
  array,
  // item, by which we will compare
  itemProperty,
  // value, for which we should find start index
  value,
  // property of value, which need for comparing
  valueProperty,
}) {
  let leftIndex = -1;
  let rightIndex = array.length;

  while (rightIndex - leftIndex !== 1) {
    const middleIndex = Math.round((leftIndex + rightIndex) / 2);
    if (array[middleIndex][itemProperty] > value[valueProperty]) {
      rightIndex = middleIndex;
    } else {
      leftIndex = middleIndex;
    }
  }

  return leftIndex;
}

module.exports = {
  binarySearchStartByProperty,
};
