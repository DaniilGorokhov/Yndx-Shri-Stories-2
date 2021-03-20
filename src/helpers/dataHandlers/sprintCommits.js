const { binarySearchStartByProperty } = require('./binarySearchStartByProperty');

// Return object with properties:
// - sprintCommitsArray is array of objects (sprints) with property commits,
// that contain all commits belong to it;
// - activeCommits is reference on sprint.commits, where sprint - active sprint;
// - previousCommits is reference on sprint.commits,
// where sprint - previous related to active sprint;
function sprintCommits(sprints, commits) {
  const sprintCommitsMap = new Map();

  const lastSprint = sprints[sprints.length - 1];
  // finisher is a end of last possible sprint.
  // It is necessary for ensure, that our commits do not exceed possible sprints time
  const finisher = { startAt: lastSprint.finishAt + 1 };

  for (let commitIx = 0; commitIx < commits.length; commitIx += 1) {
    const commit = commits[commitIx];
    const newCommit = { ...commit };

    const index = binarySearchStartByProperty({
      array: [...sprints, finisher],
      itemProperty: 'startAt',
      value: newCommit,
      valueProperty: 'timestamp',
    });

    // Ignore commit if it belongs to not exist sprint
    if (index !== -1 && index !== sprints.length) {
      const sprintId = sprints[index].id;

      if (sprintCommitsMap.has(sprintId)) {
        const currentSprintCommits = sprintCommitsMap.get(sprintId);
        currentSprintCommits.push(newCommit);
      } else {
        sprintCommitsMap.set(sprintId, [newCommit]);
      }
    }
  }

  const sprintCommitsArray = [];
  let activeCommits;
  let previousCommits;

  for (let sprintIx = 0; sprintIx < sprints.length; sprintIx += 1) {
    const sprint = sprints[sprintIx];
    const newSprint = { ...sprint };

    const currentSprintCommits = sprintCommitsMap.get(sprint.id);
    if (currentSprintCommits instanceof Array) {
      newSprint.commits = currentSprintCommits;
    } else {
      newSprint.commits = [];
    }

    if (newSprint.active) {
      activeCommits = newSprint.commits;
      if (sprintIx === 0) {
        previousCommits = [];
      } else {
        previousCommits = sprintCommitsArray[sprintIx - 1].commits;
      }
    }

    sprintCommitsArray.push(newSprint);
  }

  return { sprintCommitsArray, activeCommits, previousCommits };
}

module.exports = {
  sprintCommits,
};
