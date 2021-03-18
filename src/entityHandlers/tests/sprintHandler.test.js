const {
  sprints,
  activeSprint,
  handledSprintsId,
  sprintHandler,
} = require('../sprintHandler');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');

afterEach(() => {
  while (sprints.length) sprints.pop();
  handledSprintsId.forEach((value) => handledSprintsId.delete(value));
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

  test('do not rewrite sprint if passed sprint with same id', () => {
    const sprint1 = getTestSprint();
    const sprint2 = getTestSprint();
    sprint2.name = 'test sprint name2';

    sprintHandler(sprint1, sprint1.id);
    sprintHandler(sprint2, sprint1.id);

    expect(sprints).toHaveLength(1);
    expect(sprints[0].name).toBe(sprint1.name);
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

  test('save copy of active sprint in exported variable activeSprint', () => {
    const sprint = getTestSprint();

    sprintHandler(sprint, sprint.id);

    expect(activeSprint).toStrictEqual({
      id: sprint.id,
      name: sprint.name,
      startAt: sprint.startAt,
      finishAt: sprint.finishAt,
      active: true,
    });
  });
});
