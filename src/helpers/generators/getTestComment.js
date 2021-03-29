// This function generates comment entity with passed property values.
function getTestComment({
  commentId = '11112222-3333-4444-5555-666677778888',
  author = 1,
  createdAt = Date.now(),
  likes = [],
} = {}) {
  const comment = {
    id: commentId,
    type: 'Comment',
    author,
    message: 'test comment message',
    likes,
    createdAt,
  };

  return comment;
}

module.exports = {
  getTestComment,
};
