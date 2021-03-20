const {
  sprints,
  activeSprint,
  sprintHandler,
} = require('../sprintHandler');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');

afterEach(() => {
  while (sprints.length) sprints.pop();
});

describe('sprintHandler function tests', () => {
  test('throw error if activeSprintId argument did not pass', () => {
    const sprint = getTestSprint();

    expect(
      () => sprintHandler(sprint),
    ).toThrow('error: activeSprint argument did not pass; it is necessary argument');
  });

  test('save sprint by id', () => {
    const now = Date.now();
    const sprint = getTestSprint({ startAt: now, finishAt: now + 1000 });

    sprintHandler(sprint, sprint.id + 1);

    expect(sprints).toHaveLength(1);
    expect(sprints[0]).toStrictEqual({
      id: 1,
      name: 'test sprint name1',
      startAt: now,
      finishAt: now + 1000,
    });
  });

  test('add active property with value true if sprint.id is activeSprintId', () => {
    const sprint = getTestSprint();

    sprintHandler(sprint, sprint.id);

    expect(sprints).toHaveLength(1);
    expect(sprints[0]).toHaveProperty('active', true);
  });

  test('do not add active property if sprint.id is nor activeSprintIx', () => {
    const sprint = getTestSprint();

    sprintHandler(sprint, sprint.id + 1);

    expect(sprints).toHaveLength(1);
    expect(sprints[0]).not.toHaveProperty('active');
  });

  test('save copy of active sprint in exported variable activeSprint '
    + 'in property data as reference to object', () => {
    const sprint = getTestSprint();

    sprintHandler(sprint, sprint.id);

    expect(activeSprint.data).toStrictEqual({
      id: sprint.id,
      name: sprint.name,
      startAt: sprint.startAt,
      finishAt: sprint.finishAt,
      active: true,
    });
    expect(activeSprint.data).toBe(sprints[0]);
  });
});
