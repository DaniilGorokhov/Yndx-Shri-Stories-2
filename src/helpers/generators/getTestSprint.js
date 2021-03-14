function getTestSprint({
  sprintId = 1,
  name = `test sprint name${sprintId}`,
  startAt = Date.now(),
  finishAt = Date.now(),
} = {}) {
  const sprint = {
    id: sprintId,
    type: 'Sprint',
    name,
    startAt,
    finishAt,
  };

  return sprint;
}

module.exports = {
  getTestSprint,
};
