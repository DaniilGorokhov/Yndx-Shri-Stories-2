const { getTestIssue } = require('../getTestIssue');

describe('getTestIssue function tests', () => {
  test('return issue object', () => {
    const now = Date.now();
    const issue = getTestIssue({ createdAt: now });

    expect(issue).toStrictEqual({
      id: '5fb693b5dd6774076443b29a',
      type: 'Issue',
      status: 'open',
      name: 'test issue name',
      comments: [],
      createdAt: now,
    });
  });

  test('return new object each call', () => {
    const issue = getTestIssue();
    const issueAgain = getTestIssue();

    issue.name = 'test issue name2';

    expect(issue.name).not.toBe(issueAgain.name);
  });

  test('return issue with selected status', () => {
    const issue = getTestIssue({ status: 'inProgress' });

    expect(issue.status).toBe('inProgress');
  });

  test('return issue with resolvedBy', () => {
    const issue = getTestIssue({ resolvedBy: true });

    expect(issue.resolvedBy.id).toBe(1);
  });

  test('return issue with resolvedBy with resolvedByUserId', () => {
    const issue = getTestIssue({ resolvedBy: true, resolvedByUserId: 2 });

    expect(issue.resolvedBy.id).toBe(2);
  });

  test('return issue with resolvedBy with resolvedByAsUserId', () => {
    const issue = getTestIssue({ resolvedBy: true, resolvedByAsUserId: true });

    expect(issue.resolvedBy).toBe(1);
  });

  test('return issue with resolution', () => {
    const issue = getTestIssue({ resolution: true });

    expect(issue.resolution).toBe('fixed');
  });

  test('return issue with selected resolutionStatus', () => {
    const issue = getTestIssue({ resolution: true, resolutionStatus: 'cancelled' });

    expect(issue.resolution).toBe('cancelled');
  });

  test('return issue with finishedAt', () => {
    const now = Date.now();
    const issue = getTestIssue({ finishedAt: true, finishedAtTimestamp: now });

    expect(issue.finishedAt).toBe(now);
  });
});
