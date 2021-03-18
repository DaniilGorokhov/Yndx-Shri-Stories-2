function getTestSprint({
  sprintId = 1,
  active = false,
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

  if (active) {
    sprint.active = true;
  }

  return sprint;
}

module.exports = {
  getTestSprint,
};
