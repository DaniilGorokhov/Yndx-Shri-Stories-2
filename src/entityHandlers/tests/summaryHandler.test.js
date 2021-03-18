const { getTestSummary } = require('../../helpers/generators/getTestSummary');
const { summaries, summaryHandler } = require('../summaryHandler');

afterEach(() => {
  summaries.forEach((value, key) => summaries.delete(key));
});

describe('summaryHandler function tests', () => {
  test('do not have return', () => {
    const summary = getTestSummary();

    expect(summaryHandler(summary)).toBeUndefined();
  });

  test('save summary only with 2 properties id and value', () => {
    const summary = getTestSummary();

    summaryHandler(summary);

    expect(summaries.size).toBe(1);
    expect(summaries.get(summary.id)).toStrictEqual({
      id: summary.id,
      value: summary.added + summary.removed,
    });
  });

  test('do not change passed summary', () => {
    const summary = getTestSummary();
    const summaryCopy = { ...summary };

    summaryHandler(summary);

    expect(summary).toStrictEqual(summaryCopy);
  });

  test('do not rewrite summary with the same id as saved in summaries', () => {
    const summary = getTestSummary();
    const summaryAgain = getTestSummary();
    summary.added += 50;

    summaryHandler(summary);
    summaryHandler(summaryAgain);

    expect(summaries.get(summary.id).added).not.toBe(summaryAgain.added);
  });
});
