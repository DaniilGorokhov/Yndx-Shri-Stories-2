// This function generates Map where by user.id are stored likes (likeItems).
function getHandledTestLikes({
  userIds = [],
  likeItems = [],
}) {
  const handledLikes = new Map();

  for (let ix = 0; ix < userIds.length; ix += 1) {
    handledLikes.set(userIds[ix], likeItems[ix]);
  }

  return handledLikes;
}

module.exports = {
  getHandledTestLikes,
};
