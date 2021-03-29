const { userCommits } = require('../userCommits');

const { getHandledTestUsers } = require('../../generators/handledEntities/getHandledTestUsers');
const { getHandledTestCommits } = require('../../generators/handledEntities/getHandledTestCommits');

describe('userCommits function tests', () => {
  test('return array', () => {
    const usersToTest = getHandledTestUsers({ userIds: [1] });
    const commitsToTest = getHandledTestCommits();
    const userCommitsArray = userCommits(usersToTest, commitsToTest);

    expect(userCommitsArray).toBeInstanceOf(Array);
  });

  test('return array of objects, that have only properties id, name, avatar and valueText', () => {
    const now = Date.now();

    const usersToTest = getHandledTestUsers({
      userIds: [1],
    });

    const commitsToTest = getHandledTestCommits({
      commitIds: ['111-x'],
      authorIds: [1],
      timestamps: [now - 1000],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest);

    expect(userCommitsArray).toHaveLength(1);
    expect(userCommitsArray[0]).toStrictEqual({
      id: 1,
      name: 'test username1',
      avatar: '1.jpg',
      valueText: '1',
    });
  });

  test('return right data if some passed users have not commits', () => {
    const usersToTest = getHandledTestUsers({ userIds: [1, 2] });

    const commitsToTest = getHandledTestCommits({
      commitIds: [],
      authorIds: [],
      timestamps: [],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest);

    expect(userCommitsArray).toHaveLength(0);
  });

  test('return data with right counted commits per user', () => {
    const now = Date.now();

    const usersToTest = getHandledTestUsers({ userIds: [1, 2] });

    const commitsToTest = getHandledTestCommits({
      commitIds: ['111-x', '311-x', '411-x', '211-x', '511-x'],
      authorIds: [1, 1, 1, 2, 2],
      timestamps: [now - 1000, now - 1500, now - 50, now - 1000, now - 100],
    });

    const userCommitsArray = userCommits(usersToTest, commitsToTest);

    expect(userCommitsArray).toHaveLength(2);
    expect(userCommitsArray[0].valueText).toBe('3');
    expect(userCommitsArray[1].valueText).toBe('2');
  });

  test('do not change passed users', () => {
    const usersToTest = getHandledTestUsers({ userIds: [1] });
    const commitsToTest = getHandledTestCommits();

    const usersToTestCopy = new Map();
    usersToTest.forEach((value, key) => usersToTestCopy.set(key, value));

    userCommits(usersToTest, commitsToTest);

    expect(usersToTest).toStrictEqual(usersToTestCopy);
  });

  test('do not change passed commits', () => {
    const usersToTest = getHandledTestUsers({ userIds: [1] });
    const commitsToTest = getHandledTestCommits();

    const commitsToTestCopy = [...commitsToTest];

    userCommits(usersToTest, commitsToTest);

    expect(commitsToTest).toStrictEqual(commitsToTestCopy);
  });
});
