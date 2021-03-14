const { getTestSummary } = require('../getTestSummary');
const { getTestComment } = require('../getTestComment');

describe('getTestSummary function tests', () => {
  test('return summary object', () => {
    const summary = getTestSummary();

    expect(summary).toStrictEqual({
      id: 1,
      type: 'Summary',
      path: './testpath1.js',
      added: 100,
      removed: 50,
    });
  });

  test('return new object each call', () => {
    const summary = getTestSummary();
    const summaryAgain = getTestSummary();
    summary.added = 200;

    expect(summary.added).not.toBe(summaryAgain.added);
  });

  test('return summary with selected id property', () => {
    const summary = getTestSummary({ summaryId: 2 });

    expect(summary.id).toBe(2);
  });

  test('return summary with selected path property', () => {
    const summary = getTestSummary({ path: './testpath2.js' });

    expect(summary.path).toBe('./testpath2.js');
  });

  test('return summary with selected added property', () => {
    const summary = getTestSummary({ added: 200 });

    expect(summary.added).toBe(200);
  });

  test('return summary with selected removed property', () => {
    const summary = getTestSummary({ removed: 300 });

    expect(summary.removed).toBe(300);
  });

  test('return summary with comments property as empty array if passed comments', () => {
    const summary = getTestSummary({ comments: true });

    expect(summary.comments).toBeInstanceOf(Array);
    expect(summary.comments).toStrictEqual([]);
  });

  test('return summary with selected comments if passed', () => {
    const comments = [];
    for (let commentId = 2; commentId < 5; commentId += 1) {
      comments.push(getTestComment({ commentId }));
    }
    const summary = getTestSummary({ comments: true, commentItems: comments });

    expect(summary.comments).toStrictEqual(comments);
  });
});
