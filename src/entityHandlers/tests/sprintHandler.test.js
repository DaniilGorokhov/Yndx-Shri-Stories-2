const { sprintHandler } = require('../sprintHandler');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');

const sprintsStorage = [];
const activeSprintStorage = {};

afterEach(() => {
  while (sprintsStorage.length) sprintsStorage.pop();

  delete activeSprintStorage.data;
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

    sprintHandler(sprint, sprint.id + 1, sprintsStorage, activeSprintStorage);

    expect(sprintsStorage).toHaveLength(1);
    expect(sprintsStorage[0]).toStrictEqual({
      id: 1,
      name: 'test sprint name1',
      startAt: now,
      finishAt: now + 1000,
    });
  });

  test('add active property with value true if sprint.id is activeSprintId', () => {
    const sprint = getTestSprint();

    sprintHandler(sprint, sprint.id, sprintsStorage, activeSprintStorage);

    expect(sprintsStorage).toHaveLength(1);
    expect(sprintsStorage[0]).toHaveProperty('active', true);
  });

  test('do not add active property if sprint.id is nor activeSprintIx', () => {
    const sprint = getTestSprint();

    sprintHandler(sprint, sprint.id + 1, sprintsStorage, activeSprintStorage);

    expect(sprintsStorage).toHaveLength(1);
    expect(sprintsStorage[0]).not.toHaveProperty('active');
  });

  test('save copy of active sprint in exported variable activeSprint '
    + 'in property data as reference to object', () => {
    const sprint = getTestSprint();

    sprintHandler(sprint, sprint.id, sprintsStorage, activeSprintStorage);

    expect(activeSprintStorage.data).toStrictEqual({
      id: sprint.id,
      name: sprint.name,
      startAt: sprint.startAt,
      finishAt: sprint.finishAt,
      active: true,
    });
    expect(activeSprintStorage.data).toBe(sprintsStorage[0]);
  });
});
