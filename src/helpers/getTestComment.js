const { getTestUser } = require('./getTestUser');

function getTestComment({
  userAsId = false,
  userId = 1,
  createdAt = Date.now(),
  likes = [],
} = {}) {
  const commentLikes = likes.map((like) => {
    if (typeof like === 'object') {
      if (like.userAsId) {
        return like.id;
      }
      return getTestUser({ startId: like.id });
    }
    return getTestUser({ startId: like });
  });

  const comment = {
    id: '11112222-3333-4444-5555-666677778888',
    type: 'Comment',
    author: userAsId ? userId : getTestUser({ startId: userId }),
    message: 'test comment message',
    likes: commentLikes,
    createdAt,
  };

  return comment;
}

module.exports = {
  getTestComment,
};
