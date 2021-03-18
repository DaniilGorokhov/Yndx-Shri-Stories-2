const { getHandledTestSprintCommits } = require('../getHandledTestSprintCommits');

describe('getHandledTestSprintCommits function tests', () => {
  test('return array', () => {
    const handledSprintCommitsArray = getHandledTestSprintCommits();

    expect(handledSprintCommitsArray).toBeInstanceOf(Array);
  });

  test('item of returned array has properties with selected values', () => {
    const timestamps = [
      { startAt: 0, finishAt: 9 },
      { startAt: 10, finishAt: 19 },
      { startAt: 20, finishAt: 29 },
    ];

    const handledSprintCommitsArray = getHandledTestSprintCommits({
      sprintIds: [0, 1, 2],
      activeId: 1,
      timestamps,
    });

    expect(handledSprintCommitsArray).toHaveLength(3);
    for (let ix = 0; ix < 3; ix += 1) {
      const handledSprintCommitsItem = {
        id: ix,
        name: `test sprint name${ix}`,
        startAt: timestamps[ix].startAt,
        finishAt: timestamps[ix].finishAt,
        commits: [],
      };

      if (ix === 1) {
        handledSprintCommitsItem.active = true;
      }

      expect(handledSprintCommitsArray[ix]).toStrictEqual(handledSprintCommitsItem);
    }
  });

  test('item.commits of returned array is array of commits, '
    + 'which generate by passed configs', () => {
    const timestamps = [
      { startAt: 0, finishAt: 9 },
      { startAt: 10, finishAt: 19 },
    ];

    const commitsConfigs = [
      {
        config: {
          commitIds: ['111-x'],
          authorIds: [1],
          timestamps: [5],
        },
      },
      {
        config: {
          commitIds: ['211-x'],
          authorIds: [1],
          timestamps: [15],
        },
      },
    ];

    const handledSprintCommitsArray = getHandledTestSprintCommits({
      sprintIds: [0, 1],
      activeId: 1,
      timestamps,
      commits: commitsConfigs,
    });

    expect(handledSprintCommitsArray).toHaveLength(2);
    expect(handledSprintCommitsArray[0].commits).toStrictEqual([{
      id: '111-x',
      author: 1,
      timestamp: 5,
    }]);
    expect(handledSprintCommitsArray[1].commits).toStrictEqual([{
      id: '211-x',
      author: 1,
      timestamp: 15,
    }]);
  });
});
