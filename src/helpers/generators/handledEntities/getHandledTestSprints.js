// This function generates array of handled sprint entities with passed timestamps and ids.
// We can specify active sprint by passing activeIx argument - sprint,
// that active property will be true.
function getHandledTestSprints({
  sprintIds = [],
  activeId = null,
  timestamps = [],
} = {}) {
  const handledSprints = [];

  for (let ix = 0; ix < sprintIds.length; ix += 1) {
    const handledSprint = {
      id: sprintIds[ix],
      name: `test sprint name${sprintIds[ix]}`,
      startAt: timestamps[ix].startAt,
      finishAt: timestamps[ix].finishAt,
    };

    if (activeId === sprintIds[ix]) {
      handledSprint.active = true;
    }

    handledSprints.push(handledSprint);
  }

  return handledSprints;
}

module.exports = {
  getHandledTestSprints,
};
