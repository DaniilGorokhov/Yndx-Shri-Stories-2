const { getTestCommit } = require('../getTestCommit');
const { getTestUser } = require('../getTestUser');
const { getTestSummary } = require('../getTestSummary');

describe('getTestCommit function tests', () => {
  test('return commit object', () => {
    const now = Date.now();
    const commit = getTestCommit({ timestamp: now });

    expect(commit).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      type: 'Commit',
      author: 1,
      message: 'test commit message',
      summaries: [],
      timestamp: now,
    });
  });

  test('return new object each call', () => {
    const commit = getTestCommit();
    const commitAgain = getTestCommit();

    commit.message = 'test commit message2';

    expect(commit.message).not.toBe(commitAgain.message);
  });

  test('return commit with selected id', () => {
    const commit = getTestCommit({ commitId: '3-11x' });

    expect(commit.id).toBe('3-11x');
  });

  test('return commit with author as user.id by default', () => {
    const commit = getTestCommit();

    expect(commit.author).toBe(1);
  });

  test('return commit with author as user entity if author passed', () => {
    const author = getTestUser();
    const commit = getTestCommit({ author });

    expect(commit.author).toStrictEqual(author);
  });

  test('return commit with selected author id if author passed as user.id', () => {
    const authorId = 2;
    const commit = getTestCommit({ author: authorId });

    expect(commit.author).toBe(authorId);
  });

  test('return commit with passed summaries', () => {
    const summaries = [];
    for (let summaryId = 1; summaryId < 4; summaryId += 1) {
      summaries.push(getTestSummary({
        summaryId,
      }));
    }
    const commit = getTestCommit({ summaries });

    expect(commit.summaries).toStrictEqual(summaries);
  });

  test('return commit with selected timestamp', () => {
    const now = Date.now();
    const commit = getTestCommit({ timestamp: now + 10000 });

    expect(commit.timestamp).toBe(now + 10000);
  });
});
