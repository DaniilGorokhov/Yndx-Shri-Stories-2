// This function generates issue entity with passed property values.
function getTestIssue({
  issueId = '5fb693b5dd6774076443b29a',
  status = 'open', // can be 'open' | 'inProgress' | 'closed'
  comments = [],
  resolvedBy = false,
  resolvedByUser = 1,
  resolution = false,
  resolutionStatus = 'fixed', // can be 'fixed' | 'cancelled' | 'duplicate'
  createdAt = Date.now(),
  finishedAt = false,
  finishedAtTimestamp = Date.now(),
} = {}) {
  const issue = {
    id: issueId,
    type: 'Issue',
    name: 'test issue name',
    status,
    comments,
    createdAt,
  };

  if (resolvedBy) {
    issue.resolvedBy = resolvedByUser;
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
