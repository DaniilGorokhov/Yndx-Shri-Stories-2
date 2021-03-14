function votePrepareData(userLikesArray, activeSprint) {
  const preparedData = {
    alias: 'vote',
    data: {
      title: 'Самый 🔎 внимательный разработчик',
      subtitle: activeSprint.name,
      emoji: '🔎',
      users: userLikesArray,
    },
  };

  return preparedData;
}

module.exports = {
  votePrepareData,
};
