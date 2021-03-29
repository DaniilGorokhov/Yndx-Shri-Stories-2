// Return index of arrayItem, which is closest to value (can be equal) on the left side.
// If there is not for value arrayItem on the left side, return -1.
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
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    // Math.floor + multiplication by 10000 for solve errors with float numbers comparing
    if (Math.floor(array[middleIndex][itemProperty] * 10000)
      > Math.floor(value[valueProperty] * 10000)) {
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
