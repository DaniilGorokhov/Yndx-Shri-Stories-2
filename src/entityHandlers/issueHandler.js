const { userHandler } = require('./userHandler');

function issueHandler(issue) {
  if (issue.resolvedBy && typeof issue.resolvedBy === 'object') {
    userHandler(issue.resolvedBy);
  }
}

module.exports = {
  issueHandler,
};
