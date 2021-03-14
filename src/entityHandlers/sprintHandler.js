const sprints = new Map();

function sprintHandler(sprint) {
  if (!sprints.has(sprint.id)) {
    sprints.set(sprint.id, {
      id: sprint.id,
      name: sprint.name,
      startAt: sprint.startAt,
      finishAt: sprint.finishAt,
    });
  }
}

module.exports = {
  sprints,
  sprintHandler,
};
