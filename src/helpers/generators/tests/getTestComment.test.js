const { getTestUser } = require('../getTestUser');
const { getTestComment } = require('../getTestComment');

describe('getTestComment function tests', () => {
  test('return comment object', () => {
    const now = Date.now();
    const comment = getTestComment({ createdAt: now });

    expect(comment).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      type: 'Comment',
      author: 1,
      message: 'test comment message',
      likes: [],
      createdAt: now,
    });
  });

  test('return new object each call', () => {
    const comment = getTestComment();
    const commentAgain = getTestComment();

    comment.message = 'test comment message2';

    expect(comment.message).not.toBe(commentAgain.message);
  });

  test('return comment with selected id', () => {
    const comment = getTestComment({
      commentId: '99992222-3333-4444-5555-666677778888',
    });

    expect(comment.id).toBe('99992222-3333-4444-5555-666677778888');
  });

  test('return comment with author as user.id by default', () => {
    const comment = getTestComment();

    expect(comment.author).toBe(1);
  });

  test('return comment with author as selected user.id', () => {
    const authorId = 2;
    const comment = getTestComment({ author: authorId });

    expect(comment.author).toBe(authorId);
  });

  test('return comment with author as user entity if passed', () => {
    const author = getTestUser();
    const comment = getTestComment({ author });

    expect(comment.author).toStrictEqual(author);
  });

  test('return comment with likes as array of users (user entity or user.id) if they passed', () => {
    const user2 = getTestUser({ userId: 2 });
    const user3 = getTestUser({ userId: 3 });
    const user4Id = 4;
    const comment = getTestComment({ likes: [user2, user3, user4Id] });

    expect(comment.likes[0].id).toBe(user2.id);
    expect(comment.likes[1].id).toBe(user3.id);
    expect(comment.likes[2]).toBe(user4Id);
  });
});
