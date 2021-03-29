const { getTestSummary } = require('../../helpers/generators/getTestSummary');
const { summaryHandler } = require('../summaryHandler');

const summariesStorage = new Map();

afterEach(() => {
  summariesStorage.forEach((value, key) => {
    summariesStorage.delete(key);
  });
});

describe('summaryHandler function tests', () => {
  test('do not have return', () => {
    const summary = getTestSummary();

    expect(summaryHandler(summary, summariesStorage)).toBeUndefined();
  });

  test('save summary only with 2 properties id and value', () => {
    const summary = getTestSummary();

    summaryHandler(summary, summariesStorage);

    expect(summariesStorage.size).toBe(1);
    expect(summariesStorage.get(summary.id)).toStrictEqual({
      id: summary.id,
      value: summary.added + summary.removed,
    });
  });

  test('do not change passed summary', () => {
    const summary = getTestSummary();
    const summaryCopy = { ...summary };

    summaryHandler(summary, summariesStorage);

    expect(summary).toStrictEqual(summaryCopy);
  });

  test('do not rewrite summary with the same id as saved in summaries', () => {
    const summary = getTestSummary();
    const summaryAgain = getTestSummary();
    summary.added += 50;

    summaryHandler(summary, summariesStorage);
    summaryHandler(summaryAgain, summariesStorage);

    expect(summariesStorage.get(summary.id).added).not.toBe(summaryAgain.added);
  });
});
