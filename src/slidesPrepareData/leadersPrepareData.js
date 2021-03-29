// Return data in required view for leaders slide.
function leadersPrepareData(userCommitsArray, { name }) {
  const leadersSlideData = {
    alias: 'leaders',
    data: {
      title: 'Больше всего коммитов',
      subtitle: name,
      emoji: '👑',
      users: userCommitsArray,
    },
  };

  return leadersSlideData;
}

module.exports = {
  leadersPrepareData,
};
