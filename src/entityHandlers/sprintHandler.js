// This function save sprint with required properties and save activeSprint in separate variable.
function sprintHandler(sprint, activeSprintId, sprintsStorage, activeSprintStorage) {
  if (typeof activeSprintId === 'undefined') {
    throw new Error('error: activeSprint argument did not pass; it is necessary argument');
  }

  const newSprint = {
    id: sprint.id,
    name: sprint.name,
    startAt: sprint.startAt,
    finishAt: sprint.finishAt,
  };

  if (sprint.id === activeSprintId) {
    newSprint.active = true;

    Object.assign(activeSprintStorage, { data: newSprint });
  }

  sprintsStorage.push(newSprint);
}

module.exports = {
  sprintHandler,
};
