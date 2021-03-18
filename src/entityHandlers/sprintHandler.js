const sprints = [];
const handledSprintsId = new Set();
const activeSprint = {};

function sprintHandler(sprint, activeSprintId) {
  if (typeof activeSprintId === 'undefined') {
    throw new Error('error: activeSprint argument did not pass; it is necessary argument');
  }

  if (!handledSprintsId.has(sprint.id)) {
    handledSprintsId.add(sprint.id);

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
}

module.exports = {
  sprints,
  handledSprintsId,
  activeSprint,
  sprintHandler,
};
