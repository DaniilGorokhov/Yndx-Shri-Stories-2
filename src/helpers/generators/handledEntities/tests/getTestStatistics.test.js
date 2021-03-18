const { getTestStatistics } = require('../getTestStatistics');

describe('getTestStatistics function tests', () => {
  test('return object only with properties min, mid, max, extra', () => {
    const statistics = getTestStatistics();

    expect(Object.keys(statistics)).toHaveLength(4);
    expect(statistics).toHaveProperty('min');
    expect(statistics).toHaveProperty('mid');
    expect(statistics).toHaveProperty('max');
    expect(statistics).toHaveProperty('extra');
  });

  test('returned statistics have as value 0 by default', () => {
    const statistics = getTestStatistics();

    expect(statistics).toHaveProperty('min', 0);
    expect(statistics).toHaveProperty('mid', 0);
    expect(statistics).toHaveProperty('max', 0);
    expect(statistics).toHaveProperty('extra', 0);
  });

  test('returned statistics have passed values', () => {
    const statistics = getTestStatistics({
      min: 10,
      mid: 30,
      max: 23,
      extra: 4,
    });

    expect(statistics).toHaveProperty('min', 10);
    expect(statistics).toHaveProperty('mid', 30);
    expect(statistics).toHaveProperty('max', 23);
    expect(statistics).toHaveProperty('extra', 4);
  });
});
