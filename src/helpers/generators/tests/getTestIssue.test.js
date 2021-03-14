const { getTestIssue } = require('../getTestIssue');
const { getTestUser } = require('../getTestUser');
const { getTestComment } = require('../getTestComment');

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

  test('return issue with selected id', () => {
    const issue = getTestIssue({ issueId: '34abc' });

    expect(issue.id).toBe('34abc');
  });

  test('return issue with selected status', () => {
    const issue = getTestIssue({ status: 'inProgress' });

    expect(issue.status).toBe('inProgress');
  });

  test('return issue with resolvedBy', () => {
    const issue = getTestIssue({ resolvedBy: true });

    expect(issue.resolvedBy).toBe(1);
  });

  test('return issue with selected resolvedBy', () => {
    const user = getTestUser();
    const issue = getTestIssue({ resolvedBy: true, resolvedByUser: user });

    expect(issue.resolvedBy).toStrictEqual(user);
  });

  test('return issue with selected resolvedBy as user.id', () => {
    const userId = 2;
    const issue = getTestIssue({ resolvedBy: true, resolvedByUser: userId });

    expect(issue.resolvedBy).toBe(userId);
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

  test('return issue with empty comments property array by default', () => {
    const issue = getTestIssue();

    expect(issue.comments).toBeInstanceOf(Array);
    expect(issue.comments).toHaveLength(0);
  });

  test('return issue with property comments, that contain passed comments', () => {
    const comments = [];
    for (let commentId = 1; commentId < 4; commentId += 1) {
      comments.push(getTestComment({ commentId: `${commentId}1112222-3333-4444-5555-666677778888` }));
    }
    const issue = getTestIssue({ comments });

    expect(issue.comments).toStrictEqual(comments);
  });
});
