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

  return processedUser.id;
}

module.exports = {
  users,
  userHandler,
};
