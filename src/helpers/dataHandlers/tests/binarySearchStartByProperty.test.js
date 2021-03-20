const { binarySearchStartByProperty } = require('../binarySearchStartByProperty');

describe('binarySearchStartByProperty function tests', () => {
  test('return index as number', () => {
    const result = binarySearchStartByProperty({
      array: [{}],
      itemProperty: '',
      value: {},
      valueProperty: '',
    });

    expect(result).toBe(0);
  });

  test('do not change passed array', () => {
    const array = [
      { value: 1 },
      { value: 21 },
      { value: 35 },
      { value: 55 },
    ];
    const arrayCopy = array.map((item) => ({ ...item }));

    const value = {
      value: 64,
    };
    const index = binarySearchStartByProperty({
      array,
      itemProperty: 'value',
      value,
      valueProperty: 'value',
    });

    expect(array).toStrictEqual(arrayCopy);
    expect(index).toBe(array.length - 1);
  });

  describe('return max left index, if array[index] store item, '
    + 'that is non-strict less, than value', () => {
    test('return right index if value.valueProperty equal to one item value', () => {
      const array = [
        { value: 1 },
        { value: 3 },
        { value: 5 },
      ];
      const index = binarySearchStartByProperty({
        array,
        itemProperty: 'value',
        value: { value: 3 },
        valueProperty: 'value',
      });

      expect(index).toBe(1);
    });

    test('return right index if value.valueProperty equal to several items value', () => {
      const array = [
        { value: 1 },
        { value: 3 },
        { value: 5 },
        { value: 5 },
        { value: 5 },
        { value: 7 },
      ];
      const index = binarySearchStartByProperty({
        array,
        itemProperty: 'value',
        value: { value: 5 },
        valueProperty: 'value',
      });

      expect(index).toBe(4);
    });

    test('return right index if value.valueProperty do not equal to someone items value', () => {
      const array = [
        { value: 1 },
        { value: 3 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
      ];
      const index = binarySearchStartByProperty({
        array,
        itemProperty: 'value',
        value: { value: 4 },
        valueProperty: 'value',
      });

      expect(index).toBe(1);
    });

    test('return right index if value.valueProperty is the smallest value '
      + 'and do not equal to any item value', () => {
      const array = [
        { value: 1 },
        { value: 3 },
        { value: 5 },
        { value: 5 },
        { value: 5 },
        { value: 7 },
      ];
      const index = binarySearchStartByProperty({
        array,
        itemProperty: 'value',
        value: { value: 0 },
        valueProperty: 'value',
      });

      expect(index).toBe(-1);
    });

    test('return right index if value.valueProperty is the greatest value '
      + 'and do not equal to any item value', () => {
      const array = [
        { value: 1 },
        { value: 16 },
        { value: 28 },
        { value: 39 },
        { value: 40 },
      ];
      const index = binarySearchStartByProperty({
        array,
        itemProperty: 'value',
        value: { value: 50 },
        valueProperty: 'value',
      });

      expect(index).toBe(array.length - 1);
    });

    test('return right index if value.valueProperty equal to the smallest item', () => {
      const array = [
        { value: 1 },
        { value: 10 },
        { value: 100 },
        { value: 1000 },
      ];
      const index = binarySearchStartByProperty({
        array,
        itemProperty: 'value',
        value: { value: 1 },
        valueProperty: 'value',
      });

      expect(index).toBe(0);
    });

    test('return right index if value.valueProperty equal to the greatest item', () => {
      const array = [
        { value: 1 },
        { value: 10 },
        { value: 100 },
        { value: 1000 },
      ];
      const index = binarySearchStartByProperty({
        array,
        itemProperty: 'value',
        value: { value: 1000 },
        valueProperty: 'value',
      });

      expect(index).toBe(array.length - 1);
    });
  });
});
