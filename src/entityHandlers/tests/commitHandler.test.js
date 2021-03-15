const { commits, commitHandler } = require('../commitHandler');

const { getTestCommit } = require('../../helpers/generators/getTestCommit');
const { getTestUser } = require('../../helpers/generators/getTestUser');

afterEach(() => {
  commits.forEach((value, key) => {
    commits.delete(key);
  });
});

describe('commitHandler tests', () => {
  test('save commits in Map', () => {
    expect(commits).toBeInstanceOf(Map);
  });

  test('do not change passed object', () => {
    const commit = getTestCommit();
    const commitCopy = { ...commit };

    commitHandler(commit);

    expect(commit).toStrictEqual(commitCopy);
  });

  test('save commits by author.id as array of commits', () => {
    const commit = getTestCommit();

    commitHandler(commit);

    expect(commits.get(commit.author)).toBeInstanceOf(Array);
    expect(commits.get(commit.author)).toHaveLength(1);
  });

  test('save commit only with properties id, author, timestamp', () => {
    const now = Date.now();
    const commit = getTestCommit({ timestamp: now });

    commitHandler(commit);

    expect(commits.get(commit.author)[0]).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      author: 1,
      timestamp: now,
    });
  });

  test('saved commit has property author as user.id', () => {
    const author = getTestUser();
    const commit = getTestCommit({ author });

    commitHandler(commit);

    expect(commits.get(author.id)[0].author).toBe(author.id);
  });

  test('do not rewrite saved commit if passed commit with same id', () => {
    const commit = getTestCommit({ timestamp: 10 });
    const commitAgain = getTestCommit({ timestamp: 100 });

    commitHandler(commit);
    commitHandler(commitAgain);

    expect(commits.get(commit.author)[0].timestamp).toBe(commit.timestamp);
  });
});
