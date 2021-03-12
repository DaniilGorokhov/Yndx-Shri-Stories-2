const { userHandler } = require('./userHandler');

function commentHandler(comment) {
  if (typeof comment.author === 'object') {
    userHandler(comment.author);
  }

  for (let likeIx = 0; likeIx < comment.likes.length; likeIx += 1) {
    if (typeof comment.likes[likeIx] === 'object') {
      userHandler(comment.likes[likeIx]);
    }
  }
  // TODO create Map for likes
}

module.exports = {
  commentHandler,
};
