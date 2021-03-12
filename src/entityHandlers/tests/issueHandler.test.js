const { issueHandler } = require('../issueHandler');
const { users } = require('../userHandler');

const { getTestIssue } = require('../../helpers/getTestIssue');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });
});

describe('issueHandler tests', () => {
  test('do not save user if issue has not resolvedBy property', () => {
    const issue = getTestIssue();

    issueHandler(issue);
    expect(users.size).toBe(0);
  });

  test('save issue.resolvedBy as user', () => {
    const issue = getTestIssue({
      resolvedBy: true,
    });

    issueHandler(issue);
    expect(users.size).toBe(1);
  });

  test('ignore issue.resolvedBy if issue.resolvedBy is user.id', () => {
    const issue = getTestIssue({
      resolvedBy: true,
      resolvedByAsUserId: true,
    });

    issueHandler(issue);
    expect(users.size).toBe(0);
  });
});
