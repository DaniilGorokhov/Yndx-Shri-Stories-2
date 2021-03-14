const users = new Map();

function userHandler(user) {
  const processedUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  if (!users.has(user.id)) {
    users.set(processedUser.id, processedUser);
  }

  for (let friendIx = 0; friendIx < user.friends.length; friendIx += 1) {
    if (typeof user.friends[friendIx] === 'object') {
      userHandler(user.friends[friendIx]);
    }
  }

  return processedUser.id;
}

module.exports = {
  users,
  userHandler,
};
