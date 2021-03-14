function getHandledTestUserLikes({
  userIds = [],
  valueTexts = [],
} = {}) {
  const handledUserLikesArray = [];
  for (let ix = 0; ix < userIds.length; ix += 1) {
    handledUserLikesArray.push({
      id: userIds[ix],
      name: `test username${userIds[ix]}`,
      avatar: `${userIds[ix]}.jpg`,
      valueText: valueTexts[ix],
    });
  }

  return handledUserLikesArray;
}

module.exports = {
  getHandledTestUserLikes,
};
