const { binarySearchStartByProperty } = require('./binarySearchStartByProperty');

// Return object with properties:
// - sprintCommitsArray is array of objects (sprints) with property commits,
// that contain all commits belong to it;
// - activeCommits is reference on sprint.commits, where sprint - active sprint;
// - previousCommits is reference on sprint.commits,
// where sprint - previous related to active sprint;
function sprintCommits(sprints, commits) {
  const sprintCommitsMap = new Map();

  for (let commitIx = 0; commitIx < commits.length; commitIx += 1) {
    const commit = commits[commitIx];
    const newCommit = {
      id: commit.id,
      author: commit.author,
      timestamp: commit.timestamp,
    };

    const index = binarySearchStartByProperty({
      array: sprints,
      itemProperty: 'startAt',
      value: newCommit,
      valueProperty: 'timestamp',
    });

    // Ignore commit if it belongs to not exist sprint
    if (index !== -1) {
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
    const newSprint = {
      id: sprint.id,
      name: sprint.name,
      commits: [],
      startAt: sprint.startAt,
      finishAt: sprint.finishAt,
    };

    const currentSprintCommits = sprintCommitsMap.get(sprint.id);
    if (currentSprintCommits instanceof Array) {
      newSprint.commits = currentSprintCommits;
    }

    if (sprint.active) {
      newSprint.active = true;

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
