const { diagramPrepareData } = require('../diagramPrepareData');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');
const {
  getTestStatistics,
} = require('../../helpers/generators/handledEntities/getTestStatistics');

describe('diagramPrepareData function tests', () => {
  test('return object only with properties alias and data', () => {
    const activeSprint = getTestSprint();
    const diagramSlideData = diagramPrepareData({}, {}, activeSprint);

    expect(Object.keys(diagramSlideData)).toHaveLength(2);
    expect(diagramSlideData).toHaveProperty('alias');
    expect(diagramSlideData).toHaveProperty('data');
  });

  test('return object alias equal to \'diagram\'', () => {
    const activeSprint = getTestSprint();
    const diagramSlideData = diagramPrepareData({}, {}, activeSprint);

    expect(diagramSlideData).toHaveProperty('alias', 'diagram');
  });

  test('returned object.data have only properties title, subtitle, '
    + 'totalText, differenceText, categories', () => {
    const activeSprint = getTestSprint();
    const activeStatistics = getTestStatistics();
    const previousStatistics = getTestStatistics();
    const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

    expect(Object.keys(data)).toHaveLength(5);
    expect(data).toHaveProperty('title', 'Размер коммитов');
    expect(data).toHaveProperty('subtitle', activeSprint.name);
    expect(data).toHaveProperty('totalText');
    expect(data).toHaveProperty('differenceText');
    expect(data).toHaveProperty('categories');
  });

  test('returned object.data.totalText has value of entire activeStatistics (sum)', () => {
    const activeSprint = getTestSprint();
    const activeStatistics = getTestStatistics({
      min: 10,
      mid: 20,
      max: 30,
      extra: 5,
    });
    const previousStatistics = getTestStatistics();
    const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

    expect(data).toHaveProperty('totalText', '65 коммитов');
  });

  describe('returned object.data.differenceText has value '
    + 'of entire activeStatistics - previousStatistics (entire statistics - sum)', () => {
    test('when value is positive', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics({
        min: 10,
        mid: 20,
        max: 30,
        extra: 5,
      });
      const previousStatistics = getTestStatistics();
      const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      expect(data).toHaveProperty('differenceText', '+65 с прошлого спринта');
    });

    test('when value is zero', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics({
        min: 10,
        mid: 20,
        max: 30,
        extra: 5,
      });
      const previousStatistics = getTestStatistics({
        min: 55,
        mid: 5,
        max: 3,
        extra: 2,
      });
      const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      expect(data).toHaveProperty('differenceText', '0 с прошлого спринта');
    });

    test('when value is negative', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics({
        min: 10,
        mid: 20,
        max: 30,
        extra: 5,
      });
      const previousStatistics = getTestStatistics({
        min: 40,
        mid: 20,
        max: 30,
        extra: 25,
      });
      const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      expect(data).toHaveProperty('differenceText', '-50 с прошлого спринта');
    });
  });

  describe('return right object.data.categories', () => {
    test('categories is array', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics();
      const previousStatistics = getTestStatistics();
      const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      expect(data.categories).toBeInstanceOf(Array);
    });

    test('return only 4 categories', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics();
      const previousStatistics = getTestStatistics();
      const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      expect(data.categories).toHaveLength(4);
    });

    test('categories item has only properties title, valueText, differenceText', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics();
      const previousStatistics = getTestStatistics();
      const { data } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      for (let ix = 0; ix < 4; ix += 1) {
        expect(Object.keys(data.categories[ix])).toHaveLength(3);
        expect(data.categories[ix]).toHaveProperty('title');
        expect(data.categories[ix]).toHaveProperty('valueText');
        expect(data.categories[ix]).toHaveProperty('differenceText');
      }
    });

    test('valueTexts of categories item correspond to activeStatistics', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics({
        min: 49,
        mid: 41,
        max: 12,
        extra: 3,
      });
      const previousStatistics = getTestStatistics();

      const {
        data: { categories },
      } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      const expectedTexts = [
        '3 коммита',
        '12 коммитов',
        '41 коммит',
        '49 коммитов',
      ];

      for (let ix = 0; ix < 4; ix += 1) {
        expect(categories[ix].valueText).toBe(expectedTexts[ix]);
      }
    });

    test('differenceTexts of categories item correspond to '
      + 'activeStatistics - previousStatistics respectively', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics({
        min: 49,
        mid: 41,
        max: 12,
        extra: 3,
      });
      const previousStatistics = getTestStatistics({
        min: 49,
        mid: 63,
        max: 9,
        extra: 13,
      });

      const {
        data: { categories },
      } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      const expectedTexts = [
        '-10 коммитов',
        '+3 коммита',
        '-22 коммита',
        '0 коммитов',
      ];

      for (let ix = 0; ix < 4; ix += 1) {
        expect(categories[ix].differenceText).toBe(expectedTexts[ix]);
      }
    });

    test('return right data, when activeStatistics is nullish '
    + 'and previous is not nullish', () => {
      const activeSprint = getTestSprint();
      const activeStatistics = getTestStatistics({
        min: 0,
        mid: 0,
        max: 0,
        extra: 0,
      });
      const previousStatistics = getTestStatistics({
        min: 25,
        mid: 4,
        max: 101,
        extra: 19,
      });

      const {
        data: { categories },
      } = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);

      const expectedValueTexts = [
        '0 коммитов',
        '0 коммитов',
        '0 коммитов',
        '0 коммитов',
      ];
      const expectedDifferenceTexts = [
        '-19 коммитов',
        '-101 коммит',
        '-4 коммита',
        '-25 коммитов',
      ];

      for (let ix = 0; ix < 4; ix += 1) {
        expect(categories[ix].valueText).toBe(expectedValueTexts[ix]);
        expect(categories[ix].differenceText).toBe(expectedDifferenceTexts[ix]);
      }
    });
  });
});
