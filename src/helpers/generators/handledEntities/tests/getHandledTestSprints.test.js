const { getHandledTestSprints } = require('../getHandledTestSprints');

describe('getHandledTestSprint function tests', () => {
  test('return array', () => {
    const sprintsToTest = getHandledTestSprints();

    expect(sprintsToTest).toBeInstanceOf(Array);
  });

  test('return array of objects with properties id, name, startAt, finishAt by default', () => {
    const sprintsToTest = getHandledTestSprints({
      sprintIds: [1],
      timestamps: [{
        startAt: 10,
        finishAt: 20,
      }],
    });

    expect(sprintsToTest).toHaveLength(1);
    expect(sprintsToTest[0]).toStrictEqual({
      id: 1,
      name: 'test sprint name1',
      startAt: 10,
      finishAt: 20,
    });
  });

  test('object of returned array should have property active with value true '
    + 'if passed activeId equal to object.id', () => {
    const sprintsToTest = getHandledTestSprints({
      sprintIds: [1, 2],
      timestamps: [
        {
          startAt: 10,
          finishAt: 20,
        },
        {
          startAt: 21,
          finishAt: 31,
        },
      ],
      activeId: 2,
    });

    expect(sprintsToTest).toHaveLength(2);
    expect(sprintsToTest[0]).not.toHaveProperty('active');
    expect(sprintsToTest[1]).toHaveProperty('active', true);
  });
});
