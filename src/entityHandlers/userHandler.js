// This function add user in storage only with required properties.
function userHandler(user, usersStorage) {
  const handledUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  usersStorage.set(handledUser.id, handledUser);
}

module.exports = {
  userHandler,
};
