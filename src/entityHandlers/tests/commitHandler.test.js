const { commitHandler } = require('../commitHandler');

const { getTestCommit } = require('../../helpers/generators/getTestCommit');
const { getTestUser } = require('../../helpers/generators/getTestUser');
const { getTestSummary } = require('../../helpers/generators/getTestSummary');

const commitsStorage = [];
const commitSummariesStorage = new Map();

afterEach(() => {
  while (commitsStorage.length) commitsStorage.pop();

  commitSummariesStorage.forEach((value, key) => {
    commitSummariesStorage.delete(key);
  });
});

describe('commitHandler function tests', () => {
  test('do not change passed object', () => {
    const commit = getTestCommit();
    const commitCopy = { ...commit };

    commitHandler(commit, commitsStorage, commitSummariesStorage);

    expect(commit).toStrictEqual(commitCopy);
  });

  test('save commit only with properties id, author, timestamp', () => {
    const now = Date.now();
    const commit = getTestCommit({ timestamp: now });

    commitHandler(commit, commitsStorage, commitSummariesStorage);

    expect(commitsStorage).toHaveLength(1);
    expect(commitsStorage[0]).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      author: 1,
      timestamp: now,
    });
  });

  test('saved commit has property author as user.id', () => {
    const author = getTestUser();
    const commit = getTestCommit({ author });

    commitHandler(commit, commitsStorage, commitSummariesStorage);

    expect(commitsStorage).toHaveLength(1);
    expect(commitsStorage[0].author).toBe(author.id);
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

    commitHandler(commit, commitsStorage, commitSummariesStorage);

    expect(commitSummariesStorage.size).toBe(1);
    expect(commitSummariesStorage.get(commit.id)).toHaveLength(10);
    expect(commitSummariesStorage.get(commit.id)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
