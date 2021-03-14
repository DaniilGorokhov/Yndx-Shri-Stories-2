function getTestCommit({
  commitId = '11112222-3333-4444-5555-666677778888',
  author = 1,
  summaries = [],
  timestamp = Date.now(),
} = {}) {
  const commit = {
    id: commitId,
    type: 'Commit',
    author,
    message: 'test commit message',
    summaries,
    timestamp,
  };

  return commit;
}

module.exports = {
  getTestCommit,
};
