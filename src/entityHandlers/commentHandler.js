const likes = new Map();

function commentHandler(comment) {
  let authorUserId;
  if (typeof comment.author === 'object') {
    authorUserId = comment.author.id;
  } else {
    authorUserId = comment.author;
  }

  const currentLikes = [];
  const wasLikeAuthorIds = new Set();
  for (let likeIx = 0; likeIx < comment.likes.length; likeIx += 1) {
    let likeAuthor = comment.likes[likeIx];
    if (typeof likeAuthor === 'object') {
      likeAuthor = likeAuthor.id;
    }

    if (!wasLikeAuthorIds.has(likeAuthor)) {
      currentLikes.push(likeAuthor);

      wasLikeAuthorIds.add(likeAuthor);
    }
  }

  const newLikesItem = {
    timestamp: comment.createdAt,
    quantity: currentLikes.length,
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
