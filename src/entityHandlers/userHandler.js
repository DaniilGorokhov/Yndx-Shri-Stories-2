const users = new Map();

function userHandler(user) {
  const handledUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  users.set(handledUser.id, handledUser);
}

module.exports = {
  users,
  userHandler,
};
