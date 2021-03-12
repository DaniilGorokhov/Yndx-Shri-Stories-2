function getTestUser({
  startId = 1,
  friendsQuantity = 0,
  friendsIndexes = [],
} = {}) {
  const friends = [];
  for (let friendIx = 0; friendIx < friendsQuantity; friendIx += 1) {
    let newUser;

    if (typeof friendsIndexes[friendIx] === 'object' && friendsIndexes[friendIx].userAsId) {
      newUser = friendsIndexes[friendIx].id;
    } else if (typeof friendsIndexes[friendIx] === 'object') {
      const newStartId = friendsIndexes[friendIx].id;
      newUser = getTestUser({ startId: newStartId });
    } else {
      const newStartId = friendsIndexes[friendIx] || startId + friendIx + 1;
      newUser = getTestUser({ startId: newStartId });
    }

    friends.push(newUser);
  }

  const user = {
    id: startId,
    type: 'User',
    name: `test username${startId}`,
    login: `testlogin${startId}`,
    avatar: `${startId}.jpg`,
    friends,
  };

  return user;
}

module.exports = {
  getTestUser,
};
