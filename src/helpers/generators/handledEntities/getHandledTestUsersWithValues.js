function getHandledTestUsersWithValues({
  userIds = [],
  valueTexts = [],
} = {}) {
  const usersWithValues = [];

  for (let userIx = 0; userIx < userIds.length; userIx += 1) {
    usersWithValues.push({
      id: userIds[userIx],
      name: `test username${userIds[userIx]}`,
      avatar: `${userIds[userIx]}.jpg`,
      valueText: valueTexts[userIx],
    });
  }

  return usersWithValues;
}

module.exports = {
  getHandledTestUsersWithValues,
};
