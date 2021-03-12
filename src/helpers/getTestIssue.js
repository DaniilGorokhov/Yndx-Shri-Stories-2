const { getTestUser } = require('./getTestUser');

function getTestIssue({
  status = 'open', // can be 'open' | 'inProgress' | 'closed'
  resolvedBy = false,
  resolvedByAsUserId = false,
  resolvedByUserId = 1,
  resolution = false,
  resolutionStatus = 'fixed', // can be 'fixed' | 'cancelled' | 'duplicate'
  createdAt = Date.now(),
  finishedAt = false,
  finishedAtTimestamp = Date.now(),
} = {}) {
  const issue = {
    id: '5fb693b5dd6774076443b29a', // 24 symbols
    type: 'Issue',
    name: 'test issue name',
    status,
    comments: [], // TODO comments (Comment | CommentId)
    createdAt,
  };

  if (resolvedBy) {
    if (resolvedByAsUserId) {
      issue.resolvedBy = resolvedByUserId;
    } else {
      issue.resolvedBy = getTestUser({
        startId: resolvedByUserId,
      });
    }
  }

  if (resolution) {
    issue.resolution = resolutionStatus;
  }

  if (finishedAt) {
    issue.finishedAt = finishedAtTimestamp;
  }

  return issue;
}

module.exports = {
  getTestIssue,
};
