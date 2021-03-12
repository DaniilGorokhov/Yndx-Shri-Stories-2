const { commitHandler } = require('../commitHandler');
const { users } = require('../userHandler');

const { getTestCommit } = require('../../helpers/getTestCommit');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });
});

describe('commitHandler tests', () => {
  describe('user entities related to commit', () => {
    test('save commit.author as user', () => {
      const commit = getTestCommit();

      commitHandler(commit);
      expect(users.size).toBe(1);
    });

    test('save not commit.author as user if commit.author - user.id', () => {
      const commit = getTestCommit({ userAsId: true });

      commitHandler(commit);
      expect(users.size).toBe(0);
    });
  });
});
