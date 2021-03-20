const sprints = [];
const activeSprint = {};

function sprintHandler(sprint, activeSprintId) {
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

    Object.assign(activeSprint, newSprint);
  }

  sprints.push(newSprint);
}

module.exports = {
  sprints,
  activeSprint,
  sprintHandler,
};
