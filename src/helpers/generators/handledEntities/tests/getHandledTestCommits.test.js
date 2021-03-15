const { getHandledTestCommits } = require('../getHandledTestCommits');

describe('getHandledTestCommits function tests', () => {
  test('return map, where key is author.id and value is array of commits', () => {
    const now = Date.now();
    const handledCommits = getHandledTestCommits({
      commitIds: [['111-x']],
      authorIds: [1],
      timestamps: [[now]],
    });

    expect(handledCommits).toBeInstanceOf(Map);
    expect(handledCommits.get(1)).toStrictEqual([{
      id: '111-x',
      author: 1,
      timestamp: now,
    }]);
  });

  test('returned map item has selected properties', () => {
    const now = Date.now();
    const handledCommits = getHandledTestCommits({
      commitIds: [['111-x', '211-x'], ['311-x']],
      authorIds: [14, 39],
      timestamps: [[now, now + 100], [now + 200]],
    });

    expect(handledCommits.get(14)).toStrictEqual([
      {
        id: '111-x',
        author: 14,
        timestamp: now,
      },
      {
        id: '211-x',
        author: 14,
        timestamp: now + 100,
      },
    ]);
    expect(handledCommits.get(39)).toStrictEqual([{
      id: '311-x',
      author: 39,
      timestamp: now + 200,
    }]);
  });
});
