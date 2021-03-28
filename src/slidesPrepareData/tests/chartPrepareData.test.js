const { chartPrepareData } = require('../chartPrepareData');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');
const {
  getHandledTestUsersWithValues,
} = require('../../helpers/generators/handledEntities/getHandledTestUsersWithValues');
const {
  getHandledTestSprintCommits,
} = require('../../helpers/generators/handledEntities/getHandledTestSprintCommits');

describe('chartPrepareData function tests', () => {
  test('return object only with properties alias and data', () => {
    const activeSprint = getTestSprint({
      active: true,
    });
    const chartSlideData = chartPrepareData([], [], activeSprint);

    expect(chartSlideData).toHaveProperty('alias');
    expect(chartSlideData).toHaveProperty('data');
    expect(Object.keys(chartSlideData)).toHaveLength(2);
  });

  test('returned object.alias is \'chart\'', () => {
    const activeSprint = getTestSprint({
      active: true,
    });
    const chartSlideData = chartPrepareData([], [], activeSprint);

    expect(chartSlideData).toHaveProperty('alias', 'chart');
  });

  test('returned object.data only has properties title, subtitle, values and users', () => {
    const activeSprint = getTestSprint({
      active: true,
    });
    const chartSlideData = chartPrepareData([], [], activeSprint);

    expect(chartSlideData.data).toHaveProperty('title', 'Коммиты');
    expect(chartSlideData.data).toHaveProperty('subtitle', activeSprint.name);
    expect(chartSlideData.data).toHaveProperty('values');
    expect(chartSlideData.data).toHaveProperty('users');
  });

  test('item of returned object.data.values have only properties title, hint, value', () => {
    const activeSprint = getTestSprint({
      active: true,
      sprintId: 3,
    });

    const sprintCommitsToTest = getHandledTestSprintCommits({
      sprintIds: [1, 2],
      timestamps: [
        { startAt: 0, finishAt: 99 },
        { startAt: 100, finishAt: 199 },
      ],
      commits: [
        {
          config: {
            commitIds: ['111-x', '411-x'],
            authorIds: [1, 1],
            timestamps: [50, 75],
          },
        },
        {
          config: {
            commitIds: ['211-x'],
            authorIds: [2],
            timestamps: [150],
          },
        },
      ],
    });

    const usersToTest = getHandledTestUsersWithValues({
      userIds: [1, 2],
      valueTexts: ['2', '1'],
    });

    const { data } = chartPrepareData(sprintCommitsToTest, usersToTest, activeSprint);

    expect(data.values).toHaveLength(2);

    expect(Object.keys(data.values[0])).toHaveLength(3);
    expect(data.values[0]).toHaveProperty('title', '2');
    expect(data.values[0]).toHaveProperty('hint', 'test sprint name2');
    expect(data.values[0]).toHaveProperty('value', 1);

    expect(Object.keys(data.values[1])).toHaveLength(3);
    expect(data.values[1]).toHaveProperty('title', '1');
    expect(data.values[1]).toHaveProperty('hint', 'test sprint name1');
    expect(data.values[1]).toHaveProperty('value', 2);
  });

  test('add active property to item of returned object.data.values '
    + 'if sprint has active property', () => {
    const activeSprint = getTestSprint({
      active: true,
    });

    const sprintCommitsToTest = getHandledTestSprintCommits({
      sprintIds: [1, 2],
      activeId: 1,
      timestamps: [
        { startAt: 0, finishAt: 99 },
        { startAt: 100, finishAt: 199 },
      ],
      commits: [
        {
          config: {
            commitIds: ['111-x', '411-x'],
            authorIds: [1, 1],
            timestamps: [50, 75],
          },
        },
        {
          config: {
            commitIds: ['211-x'],
            authorIds: [2],
            timestamps: [150],
          },
        },
      ],
    });

    const usersToTest = getHandledTestUsersWithValues({
      userIds: [1, 2],
      valueTexts: ['2', '1'],
    });

    const { data } = chartPrepareData(sprintCommitsToTest, usersToTest, activeSprint);

    expect(data.values).toHaveLength(2);

    expect(Object.keys(data.values[1])).toStrictEqual(['title', 'hint', 'value', 'active']);
    expect(data.values[1]).toHaveProperty('active', true);
  });

  test('do not change passed values', () => {
    const activeSprint = getTestSprint({
      active: true,
    });

    const sprintCommitsToTest = getHandledTestSprintCommits({
      sprintIds: [1, 2, 3],
      activeId: 1,
      timestamps: [
        { startAt: 0, finishAt: 99 },
        { startAt: 100, finishAt: 199 },
        { startAt: 200, finishAt: 299 },
      ],
      commits: [
        {
          config: {
            commitIds: ['111-x', '411-x'],
            authorIds: [1, 1],
            timestamps: [50, 75],
          },
        },
        {
          config: {
            commitIds: ['211-x'],
            authorIds: [2],
            timestamps: [150],
          },
        },
        {
          config: {
            commitIds: ['311-x'],
            authorIds: [3],
            timestamps: [250],
          },
        },
      ],
    });

    const sprintCommitsToTestCopy = JSON.parse(
      JSON.stringify(sprintCommitsToTest),
    );

    const usersToTest = getHandledTestUsersWithValues({
      userIds: [1, 2, 3],
      valueTexts: ['2', '1', '1'],
    });

    chartPrepareData(sprintCommitsToTest, usersToTest, activeSprint);

    expect(sprintCommitsToTest).toStrictEqual(sprintCommitsToTestCopy);
  });

  test('do not change passed users', () => {
    const activeSprint = getTestSprint({
      active: true,
    });

    const sprintCommitsToTest = getHandledTestSprintCommits({
      sprintIds: [1, 2, 3],
      activeId: 1,
      timestamps: [
        { startAt: 0, finishAt: 99 },
        { startAt: 100, finishAt: 199 },
        { startAt: 200, finishAt: 299 },
      ],
      commits: [
        [{
          config: {
            commitIds: ['111-x', '411-x'],
            authorIds: [1, 1],
            timestamps: [50, 75],
          },
        }],
        [{
          config: {
            commitIds: ['211-x'],
            authorIds: [2],
            timestamps: [150],
          },
        }],
        [{
          config: {
            commitIds: ['311-x'],
            authorIds: [3],
            timestamps: [250],
          },
        }],
      ],
    });

    const usersToTest = getHandledTestUsersWithValues({
      userIds: [1, 2, 3],
      valueTexts: ['2', '1', '1'],
    });

    const usersToTestCopy = JSON.parse(
      JSON.stringify(usersToTest),
    );

    chartPrepareData(sprintCommitsToTest, usersToTest, activeSprint);

    expect(usersToTest).toStrictEqual(usersToTestCopy);
  });
});
