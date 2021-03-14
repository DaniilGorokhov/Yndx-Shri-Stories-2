const likes = new Map();

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
  if (likes.has(authorUserId)) {
    const userLikes = likes.get(authorUserId);
    userLikes.push(newLikesItem);
  } else {
    const userLikes = [];
    userLikes.push(newLikesItem);
    likes.set(authorUserId, userLikes);
  }
}

module.exports = {
  likes,
  commentHandler,
};
