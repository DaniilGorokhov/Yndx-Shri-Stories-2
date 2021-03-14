const { getTestSprint } = require('../getTestSprint');

describe('getTestSprint function tests', () => {
  test('return sprint object', () => {
    const now = Date.now();
    const sprint = getTestSprint({ startAt: now - 1000, finishAt: now });

    expect(sprint).toStrictEqual({
      id: 1,
      type: 'Sprint',
      name: 'test sprint name1',
      startAt: now - 1000,
      finishAt: now,
    });
  });

  test('return new object each call', () => {
    const sprint = getTestSprint();
    const sprintAgain = getTestSprint();
    sprint.name = 'test sprint name2';

    expect(sprint.name).not.toBe(sprintAgain.name);
  });

  test('return sprint entity with selected sprintId', () => {
    const sprint = getTestSprint({ sprintId: 2 });

    expect(sprint.id).toBe(2);
  });

  test('return sprint entity with selected name', () => {
    const sprint = getTestSprint({ name: 'test sprint name2' });

    expect(sprint.name).toBe('test sprint name2');
  });

  test('return sprint entity with selected startAt', () => {
    const now = Date.now() + 100000;
    const sprint = getTestSprint({ startAt: now });

    expect(sprint.startAt).toBe(now);
  });

  test('return sprint entity with selected finishAt', () => {
    const now = Date.now() + 100000;
    const sprint = getTestSprint({ finishAt: now });

    expect(sprint.finishAt).toBe(now);
  });
});
