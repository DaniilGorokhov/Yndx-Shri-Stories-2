const { userCommits } = require('../userCommits');

const { getHandledTestUsers } = require('../../generators/handledEntities/getHandledTestUsers');
const { getHandledTestCommits } = require('../../generators/handledEntities/getHandledTestCommits');
const { getTestSprint } = require('../../generators/getTestSprint');

describe('userCommits function tests', () => {
  test('return array', () => {
    const activeSprint = getTestSprint();
    const usersToTest = getHandledTestUsers({ userIds: [1] });
    const commitsToTest = getHandledTestCommits();
    const userCommitsArray = userCommits(usersToTest, commitsToTest, activeSprint);

    expect(userCommitsArray).toBeInstanceOf(Array);
  });

  test('return array of objects, that have only properties id, name, avatar and valueText', () => {
    const now = Date.now();

    const activeSprint = getTestSprint({ startAt: now - 10000, finishAt: now });

    const usersToTest = getHandledTestUsers({
      userIds: [1],
    });

    const commitsToTest = getHandledTestCommits({
      commitIds: [['111-x']],
      authorIds: [1],
      timestamps: [[now - 1000]],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest, activeSprint);

    expect(userCommitsArray).toHaveLength(1);
    expect(userCommitsArray[0]).toStrictEqual({
      id: 1,
      name: 'test username1',
      avatar: '1.jpg',
      valueText: '1',
    });
  });

  test('return right data if some passed users have not commits', () => {
    const now = Date.now();

    const activeSprint = getTestSprint({ startAt: now - 10000, finishAt: now });

    const usersToTest = getHandledTestUsers({ userIds: [1, 2] });

    const commitsToTest = getHandledTestCommits({
      commitIds: [[]],
      authorIds: [1],
      timestamps: [[]],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest, activeSprint);

    expect(userCommitsArray).toHaveLength(2);
    expect(userCommitsArray[0].valueText).toBe('0');
    expect(userCommitsArray[1].valueText).toBe('0');
  });

  test('return data with right counted commits per user', () => {
    const now = Date.now();

    const activeSprint = getTestSprint({ startAt: now - 10000, finishAt: now });

    const usersToTest = getHandledTestUsers({ userIds: [1, 2] });

    const commitsToTest = getHandledTestCommits({
      commitIds: [['111-x', '311-x', '411-x'], ['211-x', '511-x']],
      authorIds: [1, 2],
      timestamps: [[now - 1000, now - 1500, now - 50], [now - 1000, now - 100]],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest, activeSprint);

    expect(userCommitsArray).toHaveLength(2);
    expect(userCommitsArray[0].valueText).toBe('3');
    expect(userCommitsArray[1].valueText).toBe('2');
  });

  test('return right data if some commits are strict less than activeSprint.startAt', () => {
    const now = Date.now();

    const activeSprint = getTestSprint({ startAt: now - 10000, finishAt: now });

    const usersToTest = getHandledTestUsers({ userIds: [1, 2] });

    const commitsToTest = getHandledTestCommits({
      commitIds: [['111-x', '311-x'], ['211-x']],
      authorIds: [1, 2],
      timestamps: [[now - 10000, now - 15000], [now - 20000]],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest, activeSprint);

    expect(userCommitsArray).toHaveLength(2);
    expect(userCommitsArray[0].valueText).toBe('1');
    expect(userCommitsArray[1].valueText).toBe('0');
  });

  test('return right data if some commits are strict greater than activeSprint.finishAt', () => {
    const now = Date.now();

    const activeSprint = getTestSprint({ startAt: now - 10000, finishAt: now });

    const usersToTest = getHandledTestUsers({ userIds: [1, 2] });

    const commitsToTest = getHandledTestCommits({
      commitIds: [['111-x', '311-x'], ['211-x']],
      authorIds: [1, 2],
      timestamps: [[now, now + 15000], [now + 20000]],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest, activeSprint);

    expect(userCommitsArray).toHaveLength(2);
    expect(userCommitsArray[0].valueText).toBe('1');
    expect(userCommitsArray[1].valueText).toBe('0');
  });

  test('do not change passed users', () => {
    const activeSprint = getTestSprint();
    const usersToTest = getHandledTestUsers({ userIds: [1] });
    const commitsToTest = getHandledTestCommits();

    const usersToTestCopy = new Map();
    usersToTest.forEach((value, key) => usersToTestCopy.set(key, value));

    userCommits(usersToTest, commitsToTest, activeSprint);

    expect(usersToTest).toStrictEqual(usersToTestCopy);
  });

  test('do not change passed commits', () => {
    const activeSprint = getTestSprint();
    const usersToTest = getHandledTestUsers({ userIds: [1] });
    const commitsToTest = getHandledTestCommits();

    const commitsToTestCopy = new Map();
    commitsToTest.forEach((value, key) => commitsToTestCopy.set(key, value));

    userCommits(usersToTest, commitsToTest, activeSprint);

    expect(commitsToTest).toStrictEqual(commitsToTestCopy);
  });
});
