function getTestUser({
  userId = 1,
  friendsQuantity = 0,
  friendsIndexes = [],
  comments = false,
  commentItems = [],
} = {}) {
  const friends = [];
  for (let friendIx = 0; friendIx < friendsQuantity; friendIx += 1) {
    let newUser;

    if (typeof friendsIndexes[friendIx] === 'object' && friendsIndexes[friendIx].userAsId) {
      newUser = friendsIndexes[friendIx].id;
    } else if (typeof friendsIndexes[friendIx] === 'object') {
      const newUserId = friendsIndexes[friendIx].id;
      newUser = getTestUser({ userId: newUserId });
    } else {
      const newUserId = friendsIndexes[friendIx] || userId + friendIx + 1;
      newUser = getTestUser({ userId: newUserId });
    }

    friends.push(newUser);
  }

  const user = {
    id: userId,
    type: 'User',
    name: `test username${userId}`,
    login: `testlogin${userId}`,
    avatar: `${userId}.jpg`,
    friends,
  };

  if (comments) {
    user.comments = commentItems;
  }

  return user;
}

module.exports = {
  getTestUser,
};
