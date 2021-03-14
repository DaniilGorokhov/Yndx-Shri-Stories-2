const { sprints, sprintHandler } = require('../sprintHandler');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');

afterEach(() => {
  sprints.forEach((value, key) => {
    sprints.delete(key);
  });
});

describe('sprintHandler tests', () => {
  test('save sprint by id', () => {
    const now = Date.now();
    const sprint = getTestSprint({ startAt: now, finishAt: now + 1000 });

    sprintHandler(sprint);

    expect(sprints.size).toBe(1);
    expect(sprints.get(sprint.id)).toStrictEqual({
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

    sprintHandler(sprint1);
    sprintHandler(sprint2);

    expect(sprints.get(sprint1.id).name).toBe(sprint1.name);
  });
});
