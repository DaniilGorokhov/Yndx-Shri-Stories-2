function getHandledTestCommits({
  commitIds = [[]],
  authorIds = [],
  timestamps = [[]],
} = {}) {
  const handledCommits = new Map();

  for (let ix = 0; ix < commitIds.length; ix += 1) {
    const currentAuthorCommits = [];
    for (let commitIx = 0; commitIx < commitIds[ix].length; commitIx += 1) {
      currentAuthorCommits.push({
        id: commitIds[ix][commitIx],
        author: authorIds[ix],
        timestamp: timestamps[ix][commitIx],
      });
    }

    handledCommits.set(authorIds[ix], currentAuthorCommits);
  }

  return handledCommits;
}

module.exports = {
  getHandledTestCommits,
};
