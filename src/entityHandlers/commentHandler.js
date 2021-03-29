const likes = new Map();

function commentHandler(comment) {
  if (comment.createdAt > Date.now()) return;

  let authorUserId;
  if (typeof comment.author === 'object') {
    authorUserId = comment.author.id;
  } else {
    authorUserId = comment.author;
  }

  const newLikesItem = {
    timestamp: comment.createdAt,
    quantity: comment.likes.length,
  };

  const userLikes = likes.get(authorUserId);
  if (typeof userLikes !== 'undefined') {
    userLikes.push(newLikesItem);
  } else {
    likes.set(authorUserId, [newLikesItem]);
  }
}

module.exports = {
  likes,
  commentHandler,
};
