const { commentHandler } = require('../commentHandler');
const { users } = require('../userHandler');

const { getTestComment } = require('../../helpers/getTestComment');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });
});

describe('commentHandler tests', () => {
  describe('user entities related to comment', () => {
    test('save comment.author as user', () => {
      const comment = getTestComment();

      commentHandler(comment);
      expect(users.size).toBe(1);
    });

    test('save not comment.author as user if comment.author - user.id', () => {
      const commit = getTestComment({ userAsId: true });

      commentHandler(commit);
      expect(users.size).toBe(0);
    });

    test('save users from comment.likes', () => {
      const comment = getTestComment({ likes: [2, 3, 4] });

      commentHandler(comment);
      expect(users.size).toBe(4);
    });

    test('save not users from comment.likes if each of them is user.id', () => {
      const comment = getTestComment({
        likes: [
          { userAsId: true, id: 2 },
          { userAsId: true, id: 3 },
          { userAsId: true, id: 4 },
        ],
      });

      commentHandler(comment);
      expect(users.size).toBe(1);
    });
  });
});
