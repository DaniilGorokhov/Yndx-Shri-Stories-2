const { getFormattedText } = require('./getFormattedText');

// this function wire user and they likes in active sprint
function userLikes(users, likes, { startAt, finishAt }) {
  const userLikesArray = [];

  users.forEach((user, userId) => {
    const userCopy = { ...user };

    const userLikesRaw = likes.get(userId);

    let userLikesSum = 0;
    if (userLikesRaw) {
      for (let userLikesItemIx = 0; userLikesItemIx < userLikesRaw.length; userLikesItemIx += 1) {
        const { timestamp, quantity } = userLikesRaw[userLikesItemIx];
        if (timestamp >= startAt && timestamp < finishAt) {
          userLikesSum += quantity;
        }
      }
    }

    userCopy.valueText = getFormattedText(
      userLikesSum,
      'голос',
      {
        one: '',
        twoFive: 'а',
        other: 'ов',
      },
    );

    userLikesArray.push(userCopy);
  });

  return userLikesArray;
}

module.exports = {
  userLikes,
};
