const { getHandledTestCommits } = require('./getHandledTestCommits');

// This function generate array of object with sprint property as handled sprint entity
// and commits property as array of commits, that are belong to this sprint.
// By passing activeId we can specify active sprint (sprint, that property active will be true).
function getHandledTestSprintCommits({
  sprintIds = [],
  activeId = null,
  timestamps = [],
  commits = [],
} = {}) {
  const handledSprintCommitsArray = [];

  for (let ix = 0; ix < sprintIds.length; ix += 1) {
    const sprint = {
      id: sprintIds[ix],
      name: `test sprint name${sprintIds[ix]}`,
      startAt: timestamps[ix].startAt,
      finishAt: timestamps[ix].finishAt,
    };

    if (sprint.id === activeId) {
      sprint.active = true;
    }

    let sprintCommits = [];
    if (commits.length) {
      sprintCommits = getHandledTestCommits(commits[ix].config);
    }

    const item = {
      sprint,
      commits: sprintCommits,
    };

    handledSprintCommitsArray.push(item);
  }

  return handledSprintCommitsArray;
}

module.exports = {
  getHandledTestSprintCommits,
};
