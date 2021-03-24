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

        // Math.floor + multiplication by 10000 for solve errors with float numbers comparing
        if (Math.floor(timestamp * 10000) >= Math.floor(startAt * 10000)
          && Math.floor(timestamp * 10000) < Math.floor(finishAt * 10000)) {
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
