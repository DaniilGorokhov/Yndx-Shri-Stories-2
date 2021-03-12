const { getTestCommit } = require('../getTestCommit');

describe('getTestCommit function tests', () => {
  test('return commit object', () => {
    const now = Date.now();
    const commit = getTestCommit({ timestamp: now });

    expect(commit).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      type: 'Commit',
      author: {
        id: 1,
        type: 'User',
        name: 'test username1',
        login: 'testlogin1',
        avatar: '1.jpg',
        friends: [],
      },
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

  test('return commit with author as user.id if passed userAsId parameter', () => {
    const commit = getTestCommit({ userAsId: true });

    expect(commit.author).toBe(1);
  });

  test('return commit with author with selected user.id', () => {
    const commit = getTestCommit({ userId: 2 });

    expect(commit.author.id).toBe(2);
  });
});
