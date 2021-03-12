const { getTestComment } = require('../getTestComment');

describe('getTestComment function tests', () => {
  test('return comment object', () => {
    const now = Date.now();
    const comment = getTestComment({ createdAt: now });

    expect(comment).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      type: 'Comment',
      author: {
        id: 1,
        type: 'User',
        name: 'test username1',
        login: 'testlogin1',
        avatar: '1.jpg',
        friends: [],
      },
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

  test('return comment with author as user.id if passed userAsId parameter', () => {
    const comment = getTestComment({ userAsId: true });

    expect(comment.author).toBe(1);
  });

  test('return comment with author with selected user.id', () => {
    const comment = getTestComment({ userId: 2 });

    expect(comment.author.id).toBe(2);
  });

  test('return comment with likes as array of users', () => {
    const comment = getTestComment({ likes: [2, 3] });

    expect(comment.likes[0].id).toBe(2);
    expect(comment.likes[1].id).toBe(3);
  });

  test('return comment with likes as array of user.id '
    + 'if passed in likes array objects with property userAsId', () => {
    const comment = getTestComment({
      likes: [
        { id: 2, userAsId: true },
        { id: 3, userAsId: true },
      ],
    });

    expect(comment.likes[0]).toBe(2);
    expect(comment.likes[1]).toBe(3);
  });

  test('return comment with likes as array of users '
    + 'if passed in likes array objects only with property id', () => {
    const comment = getTestComment({
      likes: [
        { id: 2 },
        { id: 3 },
      ],
    });

    expect(comment.likes[0].id).toBe(2);
    expect(comment.likes[1].id).toBe(3);
  });
});
