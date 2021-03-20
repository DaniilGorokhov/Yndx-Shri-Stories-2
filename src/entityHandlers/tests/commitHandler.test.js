const { commits, commitSummaries, commitHandler } = require('../commitHandler');

const { getTestCommit } = require('../../helpers/generators/getTestCommit');
const { getTestUser } = require('../../helpers/generators/getTestUser');
const { getTestSummary } = require('../../helpers/generators/getTestSummary');

afterEach(() => {
  while (commits.length) commits.pop();
});

describe('commitHandler function tests', () => {
  test('save commits in array', () => {
    expect(commits).toBeInstanceOf(Array);
  });

  test('do not change passed object', () => {
    const commit = getTestCommit();
    const commitCopy = { ...commit };

    commitHandler(commit);

    expect(commit).toStrictEqual(commitCopy);
  });

  test('save commit only with properties id, author, timestamp', () => {
    const now = Date.now();
    const commit = getTestCommit({ timestamp: now });

    commitHandler(commit);

    expect(commits).toHaveLength(1);
    expect(commits[0]).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      author: 1,
      timestamp: now,
    });
  });

  test('saved commit has property author as user.id', () => {
    const author = getTestUser();
    const commit = getTestCommit({ author });

    commitHandler(commit);

    expect(commits).toHaveLength(1);
    expect(commits[0].author).toBe(author.id);
  });

  test('save all summaryId of summaries property of commit', () => {
    const summariesToTest = [];
    for (let summaryId = 0; summaryId < 10; summaryId += 1) {
      if (summaryId % 2 === 1) {
        summariesToTest.push(summaryId);
      } else {
        const summary = getTestSummary({
          summaryId,
        });

        summariesToTest.push(summary);
      }
    }

    const commit = getTestCommit({
      summaries: summariesToTest,
    });

    commitHandler(commit);

    expect(commitSummaries.size).toBe(1);
    expect(commitSummaries.get(commit.id)).toHaveLength(10);
    expect(commitSummaries.get(commit.id)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
