function leadersPrepareData(userCommitsArray, activeSprint) {
  const leadersSlideData = {
    alias: 'leaders',
    data: {
      title: 'Больше всего коммитов',
      subtitle: activeSprint.name,
      emoji: '👑',
      users: userCommitsArray,
    },
  };

  return leadersSlideData;
}

module.exports = {
  leadersPrepareData,
};
