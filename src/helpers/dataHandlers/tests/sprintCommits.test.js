const { sprintCommits } = require('../sprintCommits');

const { getHandledTestCommits } = require('../../generators/handledEntities/getHandledTestCommits');
const { getHandledTestSprints } = require('../../generators/handledEntities/getHandledTestSprints');

describe('sprintCommits function tests', () => {
  test('return object with 3 properties: sprintCommitsArray, '
    + 'activeCommits, previousCommits', () => {
    const activeSprint = getHandledTestSprints({
      sprintIds: [1],
      activeId: 1,
      timestamps: [0],
    });
    const result = sprintCommits(activeSprint, []);

    expect(result).toHaveProperty('sprintCommitsArray');
    expect(result).toHaveProperty('activeCommits');
    expect(result).toHaveProperty('previousCommits');
  });

  test('do not change sprints array', () => {
    const now = Date.now();

    const sprintsToTest = getHandledTestSprints({
      sprintIds: [0, 1, 2, 3, 4],
      activeId: 0,
      timestamps: [
        { startAt: now, finishAt: now + 9 },
        { startAt: now + 10, finishAt: now + 19 },
        { startAt: now + 20, finishAt: now + 29 },
        { startAt: now + 30, finishAt: now + 39 },
        { startAt: now + 40, finishAt: now + 49 },
      ],
    });
    const sprintsToTestCopy = [...sprintsToTest];

    const commitsToTest = getHandledTestCommits({
      commitIds: ['111-x', '211-x'],
      authorIds: [1, 1],
      timestamps: [now, now],
    });

    sprintCommits(sprintsToTest, commitsToTest);

    expect(sprintsToTest).toStrictEqual(sprintsToTestCopy);
  });

  test('do not change commits array', () => {
    const now = Date.now();

    const sprintsToTest = getHandledTestSprints({
      sprintIds: [0, 1, 2, 3, 4],
      activeId: 0,
      timestamps: [
        { startAt: now, finishAt: now + 9 },
        { startAt: now + 10, finishAt: now + 19 },
        { startAt: now + 20, finishAt: now + 29 },
        { startAt: now + 30, finishAt: now + 39 },
        { startAt: now + 40, finishAt: now + 49 },
      ],
    });

    const commitsToTest = getHandledTestCommits({
      commitIds: ['111-x', '211-x'],
      authorIds: [1, 1],
      timestamps: [now, now],
    });
    const commitsToTestCopy = [...commitsToTest];

    sprintCommits(sprintsToTest, commitsToTest);

    expect(commitsToTest).toStrictEqual(commitsToTestCopy);
  });

  describe('sprintCommitsArray property', () => {
    test('sprintCommitsArray is array', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 2,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now - 3000, now - 2000, now, now],
      });

      const { sprintCommitsArray } = sprintCommits(sprintsToTest, commitsToTest);

      expect(sprintCommitsArray).toBeInstanceOf(Array);
    });

    test('sprintCommitsArray item have properties id, name, commits, startAt, finishAt, '
      + 'where id, name, startAt, finishAt are the same to sprint '
      + 'and commits consists of handled commit entities', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 1,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now - 3000, now - 2000, now, now],
      });

      const { sprintCommitsArray } = sprintCommits(sprintsToTest, commitsToTest);

      expect(sprintCommitsArray[1]).toStrictEqual({
        sprint: {
          id: sprintsToTest[1].id,
          name: sprintsToTest[1].name,
          startAt: sprintsToTest[1].startAt,
          finishAt: sprintsToTest[1].finishAt,
        },
        commits: commitsToTest.slice(2, 4),
      });
    });

    test('sprintCommitsArray item can have property active '
      + 'if sprint had active property', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 1,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now - 3000, now - 2000, now, now],
      });

      const { sprintCommitsArray } = sprintCommits(sprintsToTest, commitsToTest);

      expect(sprintCommitsArray[0].sprint).toHaveProperty('active', true);
    });

    test('sprintCommitsArray item.commits contain entire commits '
      + 'related to this item (sprint)', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2, 3],
        activeId: 2,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
          { startAt: now + 600, finishAt: now + 1200 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x', '511-x', '611-x', '711-x'],
        authorIds: [1, 1, 2, 3, 4, 1, 5],
        timestamps: [now - 3000, now - 400, now - 500, now + 500, now, now - 1200, now + 300],
      });

      const { sprintCommitsArray } = sprintCommits(sprintsToTest, commitsToTest);

      expect(sprintCommitsArray).toHaveLength(3);
      expect(sprintCommitsArray[1].commits).toHaveLength(5);
    });

    test('sprintCommitsArray item has commits property as empty array '
      + 'if did not find commits related to this item (sprint)', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2, 3],
        activeId: 2,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
          { startAt: now + 600, finishAt: now + 1200 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now - 3000, now - 2000, now, now],
      });

      const { sprintCommitsArray } = sprintCommits(sprintsToTest, commitsToTest);

      expect(sprintCommitsArray).toHaveLength(3);
      expect(sprintCommitsArray[2].commits).toStrictEqual([]);
    });
  });

  describe('activeCommits property', () => {
    test('activeCommits is a reference on commits of sprint with active property', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 2,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now, now, now, now],
      });

      const { sprintCommitsArray, activeCommits } = sprintCommits(sprintsToTest, commitsToTest);
      const activeSprint = sprintCommitsArray.find((item) => item.sprint.active);

      expect(activeCommits).toBe(activeSprint.commits);
    });

    test('return right activeCommits if some commits timestamp are strict less '
      + 'than activeSprint.startAt', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 2,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now - 10000, now - 15000, now - 20000, now],
      });

      const { activeCommits } = sprintCommits(sprintsToTest, commitsToTest);

      expect(activeCommits).toHaveLength(1);
      expect(activeCommits[0]).toStrictEqual({
        id: '411-x',
        author: 3,
        timestamp: now,
      });
    });

    test('return right activeCommits if commit timestamp is equal to activeSprint.startAt', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 1,
        timestamps: [
          { startAt: now, finishAt: now + 100 },
          { startAt: now + 101, finishAt: now + 201 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '211-x', '311-x'],
        authorIds: [1, 2, 3],
        timestamps: [now, now + 200, now + 50],
      });

      const { activeCommits } = sprintCommits(sprintsToTest, commitsToTest);

      expect(activeCommits).toHaveLength(2);
      expect(activeCommits[0].id).toBe('111-x');
      expect(activeCommits[1].id).toBe('311-x');
    });

    test('return right activeCommits if some commits timestamp are strict greater '
      + 'than activeSprint.finishAt', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 1,
        timestamps: [
          { startAt: now - 3000, finishAt: now - 2000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['011-x', '111-x', '311-x', '211-x'],
        authorIds: [4, 1, 1, 2],
        timestamps: [now - 2500, now, now + 15000, now + 20000],
      });

      const { activeCommits } = sprintCommits(sprintsToTest, commitsToTest);

      expect(activeCommits).toHaveLength(1);
      expect(activeCommits[0]).toStrictEqual({
        id: '011-x',
        author: 4,
        timestamp: now - 2500,
      });
    });

    test('return right activeCommits if commit timestamp is equal to activeSprint.finishAt', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 2,
        timestamps: [
          { startAt: now, finishAt: now + 99 },
          { startAt: now + 100, finishAt: now + 199 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '211-x', '311-x'],
        authorIds: [1, 2, 3],
        timestamps: [now + 100, now + 150, now + 50],
      });

      const { activeCommits } = sprintCommits(sprintsToTest, commitsToTest);

      expect(activeCommits).toHaveLength(2);
      expect(activeCommits[0].id).toBe('111-x');
      expect(activeCommits[1].id).toBe('211-x');
    });
  });

  describe('previousCommits property', () => {
    test('previousCommits contain commits of previous, related to active sprint', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 2,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now - 1500, now - 1250, now - 1000, now],
      });

      const { previousCommits } = sprintCommits(sprintsToTest, commitsToTest);

      const expectedPreviousCommits = commitsToTest.slice(0, 3);

      expect(previousCommits).toStrictEqual(expectedPreviousCommits);
    });

    test('previousCommits is a reference on previous, related to active sprint, commits', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 2,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now, now, now, now],
      });

      const { sprintCommitsArray, previousCommits } = sprintCommits(sprintsToTest, commitsToTest);
      const activeSprintIx = sprintCommitsArray.findIndex((item) => item.sprint.active);
      const previousSprint = sprintCommitsArray[activeSprintIx - 1];

      expect(previousCommits).toBe(previousSprint.commits);
    });

    test('previousCommits is empty array '
      + 'if active sprint is first element in sprintCommitsArray', () => {
      const now = Date.now();

      const sprintsToTest = getHandledTestSprints({
        sprintIds: [1, 2],
        activeId: 1,
        timestamps: [
          { startAt: now - 2000, finishAt: now - 1000 },
          { startAt: now - 500, finishAt: now + 500 },
        ],
      });

      const commitsToTest = getHandledTestCommits({
        commitIds: ['111-x', '311-x', '211-x', '411-x'],
        authorIds: [1, 1, 2, 3],
        timestamps: [now, now, now, now],
      });

      const { previousCommits } = sprintCommits(sprintsToTest, commitsToTest);

      expect(previousCommits).toStrictEqual([]);
    });
  });
});
