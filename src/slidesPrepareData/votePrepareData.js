// Return data in required view for vote slide.
function votePrepareData(userLikesArray, { name }) {
  const preparedData = {
    alias: 'vote',
    data: {
      title: 'Самый 🔎 внимательный разработчик',
      subtitle: name,
      emoji: '🔎',
      users: userLikesArray,
    },
  };

  return preparedData;
}

module.exports = {
  votePrepareData,
};
