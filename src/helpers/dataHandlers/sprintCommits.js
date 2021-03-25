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
  const finisher = { startAt: lastSprint.finishAt };

  for (let commitIx = 0; commitIx < commits.length; commitIx += 1) {
    const commit = commits[commitIx];
    const newCommit = { ...commit };

    const index = binarySearchStartByProperty({
      array: [...sprints, finisher],
      itemProperty: 'startAt',
      value: newCommit,
      valueProperty: 'timestamp',
    });

    // Ignore commit if it belongs to not exist sprint.
    // We compare with sprint.length, not with sprints.length - 1,
    // since we should take into account finisher
    if (index !== -1 && index !== sprints.length) {
      const sprintId = sprints[index].id;

      const currentSprintCommits = sprintCommitsMap.get(sprintId);
      if (typeof currentSprintCommits !== 'undefined') {
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
    const sprintCommitsItem = {
      // Here we do not copy sprint
      sprint,
      commits: [],
    };

    const currentSprintCommits = sprintCommitsMap.get(sprint.id);
    if (Array.isArray(currentSprintCommits)) {
      sprintCommitsItem.commits = currentSprintCommits;
    }

    if (sprint.active) {
      activeCommits = sprintCommitsItem.commits;

      if (sprintIx === 0) {
        previousCommits = [];
      } else {
        previousCommits = sprintCommitsArray[sprintIx - 1].commits;
      }
    }

    sprintCommitsArray.push(sprintCommitsItem);
  }

  return { sprintCommitsArray, activeCommits, previousCommits };
}

module.exports = {
  sprintCommits,
};
