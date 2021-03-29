// This function collect likes, that are obtained by user.
function commentHandler(comment, likesStorage) {
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

  const userLikes = likesStorage.get(authorUserId);
  if (typeof userLikes !== 'undefined') {
    userLikes.push(newLikesItem);
  } else {
    likesStorage.set(authorUserId, [newLikesItem]);
  }
}

module.exports = {
  commentHandler,
};
