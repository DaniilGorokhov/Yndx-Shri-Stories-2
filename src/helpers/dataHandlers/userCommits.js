// this function wire users and their commits during active sprint
function userCommits(users, activeCommits) {
  const userCommitsMap = new Map();

  for (let commitIx = 0; commitIx < activeCommits.length; commitIx += 1) {
    const { author } = activeCommits[commitIx];

    const oldValue = userCommitsMap.get(author) || 0;
    userCommitsMap.set(author, oldValue + 1);
  }

  const userCommitsArray = [];

  users.forEach((user, userId) => {
    const commitsQuantity = userCommitsMap.get(userId) || 0;

    const handledUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      valueText: commitsQuantity.toString(),
    };

    userCommitsArray.push(handledUser);
  });

  return userCommitsArray;
}

module.exports = {
  userCommits,
};
