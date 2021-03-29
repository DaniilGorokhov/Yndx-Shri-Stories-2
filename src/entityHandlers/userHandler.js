// Storage for users -> Map<user.id, user>.
const users = new Map();

// This function add user in storage only with required properties.
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
