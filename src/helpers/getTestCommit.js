const { getTestUser } = require('./getTestUser');

function getTestCommit({
  userAsId = false,
  userId = 1,
  timestamp = Date.now(),
} = {}) {
  const commit = {
    id: '11112222-3333-4444-5555-666677778888',
    type: 'Commit',
    author: userAsId ? userId : getTestUser({ startId: userId }),
    message: 'test commit message',
    summaries: [], // TODO summaries (Summary | SummaryId)
    timestamp,
  };

  return commit;
}

module.exports = {
  getTestCommit,
};
