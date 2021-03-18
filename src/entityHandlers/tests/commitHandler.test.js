const { commits, handledCommitsId, commitHandler } = require('../commitHandler');

const { getTestCommit } = require('../../helpers/generators/getTestCommit');
const { getTestUser } = require('../../helpers/generators/getTestUser');

afterEach(() => {
  while (commits.length) commits.pop();
  handledCommitsId.forEach((value) => handledCommitsId.delete(value));
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

  test('do not rewrite saved commit if passed commit with same id', () => {
    const commit = getTestCommit({ timestamp: 10 });
    const commitAgain = getTestCommit({ timestamp: 100 });

    commitHandler(commit);
    commitHandler(commitAgain);

    expect(commits).toHaveLength(1);
    expect(commits[0].timestamp).toBe(commit.timestamp);
  });
});
