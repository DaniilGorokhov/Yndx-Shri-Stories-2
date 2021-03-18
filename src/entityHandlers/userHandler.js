const users = new Map();

function userHandler(user) {
  const handledUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  if (!users.has(user.id)) {
    users.set(handledUser.id, handledUser);
  }

  return handledUser.id;
}

module.exports = {
  users,
  userHandler,
};
