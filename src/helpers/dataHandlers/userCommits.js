// this function wire users and their commits during active sprint
function userCommits(users, commits, { startAt, finishAt }) {
  const userCommitsArray = [];

  users.forEach((user, userId) => {
    const userCommitsRaw = commits.get(userId);

    const newUser = { ...user };
    let commitsQuantity = 0;

    if (userCommitsRaw) {
      for (let userCommitIx = 0; userCommitIx < userCommitsRaw.length; userCommitIx += 1) {
        const { timestamp } = userCommitsRaw[userCommitIx];
        if (timestamp >= startAt && timestamp <= finishAt) {
          commitsQuantity += 1;
        }
      }
    }

    newUser.valueText = commitsQuantity.toString();

    userCommitsArray.push(newUser);
  });

  return userCommitsArray;
}

module.exports = {
  userCommits,
};
