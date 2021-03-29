// Storage for likes -> Map<user.id, { timestamp, quantity }[]>.
const likes = new Map();

// This function collect likes, that are obtained by user.
function commentHandler(comment) {
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
