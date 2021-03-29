const { likes, commentHandler } = require('../commentHandler');

const { getTestComment } = require('../../helpers/generators/getTestComment');
const { getTestUser } = require('../../helpers/generators/getTestUser');

afterEach(() => {
  likes.forEach((value, key) => {
    likes.delete(key);
  });
});

describe('commentHandler function tests', () => {
  describe('likes collecting', () => {
    test('add likes entity as array for author as user.id', () => {
      const comment = getTestComment();

      commentHandler(comment);

      expect(comment.author).toBe(1);
      expect(likes.get(comment.author)).toBeInstanceOf(Array);
    });

    test('add likes entry as array for author as user entity', () => {
      const author = getTestUser();
      const comment = getTestComment({ author });

      commentHandler(comment);

      expect(comment.author).toStrictEqual(author);
      expect(likes.get(comment.author.id)).toBeInstanceOf(Array);
    });

    test('likes entry is array of objects with two property: timestamp, quantity', () => {
      const comment = getTestComment({ likes: [2, 3] });

      commentHandler(comment);

      expect(likes.get(comment.author)[0]).toHaveProperty('timestamp');
      expect(likes.get(comment.author)[0]).toHaveProperty('quantity');
    });

    test('count likes for comment and add in property quantity '
      + 'if likes is array of user entities', () => {
      const likesForComment = [];
      for (let userId = 2; userId < 4; userId += 1) {
        likesForComment.push(getTestUser({ userId }));
      }

      const comment = getTestComment({ likes: likesForComment });

      commentHandler(comment);

      expect(likes.get(comment.author)[0].quantity).toBe(2);
    });

    test('timestamp of likes item is same to comment timestamp '
      + 'if likes is array of user.id', () => {
      const now = Date.now();
      const comment = getTestComment({ likes: [2, 3], createdAt: now });

      commentHandler(comment);

      expect(likes.get(comment.author)[0].timestamp).toBe(now);
    });

    test('add several likes entries '
      + 'if there are several comments for different authors', () => {
      const author1 = getTestUser();
      const author2 = getTestUser({ userId: 2 });
      const comment1 = getTestComment({ author: author1, likes: [3, 4] });
      const comment2 = getTestComment({ author: author2, likes: [3, 4, 5] });

      commentHandler(comment1);
      commentHandler(comment2);

      expect(likes.size).toBe(2);
      expect(likes.get(comment1.author.id)[0].quantity).toBe(2);
      expect(likes.get(comment2.author.id)[0].quantity).toBe(3);
    });

    test('add several likes items in only one likes entry without rewrite '
      + 'if there are several comments for only one author', () => {
      const comment1 = getTestComment({ likes: [3, 4] });
      const comment2 = getTestComment({ likes: [3, 4, 5] });

      commentHandler(comment1);
      commentHandler(comment2);

      expect(likes.size).toBe(1);
      expect(likes.get(comment1.author)).toHaveLength(2);
      expect(likes.get(comment1.author)[0].quantity).toBe(2);
      expect(likes.get(comment1.author)[1].quantity).toBe(3);
    });
  });
});
