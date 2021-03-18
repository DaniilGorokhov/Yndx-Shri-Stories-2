const { getHandledTestCommits } = require('./getHandledTestCommits');

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
      commits: [],
    };

    if (sprint.id === activeId) {
      sprint.active = true;
    }

    if (commits.length) {
      sprint.commits = getHandledTestCommits(commits[ix].config);
    }

    handledSprintCommitsArray.push(sprint);
  }

  return handledSprintCommitsArray;
}

module.exports = {
  getHandledTestSprintCommits,
};
