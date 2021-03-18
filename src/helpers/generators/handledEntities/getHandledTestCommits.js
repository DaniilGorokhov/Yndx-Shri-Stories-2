function getHandledTestCommits({
  commitIds = [],
  authorIds = [],
  timestamps = [],
} = {}) {
  const handledCommits = [];

  for (let ix = 0; ix < commitIds.length; ix += 1) {
    const commit = {
      id: commitIds[ix],
      author: authorIds[ix],
      timestamp: timestamps[ix],
    };

    handledCommits.push(commit);
  }

  return handledCommits;
}

module.exports = {
  getHandledTestCommits,
};
