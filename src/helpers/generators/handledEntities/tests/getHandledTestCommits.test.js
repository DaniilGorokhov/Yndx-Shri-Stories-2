const { getHandledTestCommits } = require('../getHandledTestCommits');

describe('getHandledTestCommits function tests', () => {
  test('return array', () => {
    const now = Date.now();
    const handledCommits = getHandledTestCommits({
      commitIds: ['111-x'],
      authorIds: [1],
      timestamps: [now],
    });

    expect(handledCommits).toBeInstanceOf(Array);
  });

  test('each object of returned array has selected properties', () => {
    const now = Date.now();
    const handledCommits = getHandledTestCommits({
      commitIds: ['111-x', '211-x', '311-x'],
      authorIds: [14, 39, 28],
      timestamps: [now, now + 100, now + 200],
    });

    expect(handledCommits).toStrictEqual([
      {
        id: '111-x',
        author: 14,
        timestamp: now,
      },
      {
        id: '211-x',
        author: 39,
        timestamp: now + 100,
      },
      {
        id: '311-x',
        author: 28,
        timestamp: now + 200,
      },
    ]);
  });
});
