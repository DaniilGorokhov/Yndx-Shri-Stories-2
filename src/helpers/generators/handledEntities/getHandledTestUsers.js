// This function generates Map<user.id, user>.
function getHandledTestUsers({
  userIds = [],
}) {
  const handledUsers = new Map();

  userIds.forEach((id) => {
    handledUsers.set(id, {
      id,
      name: `test username${id}`,
      avatar: `${id}.jpg`,
    });
  });

  return handledUsers;
}

module.exports = {
  getHandledTestUsers,
};
