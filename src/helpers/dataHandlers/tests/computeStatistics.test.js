const { computeStatistics } = require('../computeStatistics');

const {
  getHandledTestCommits,
} = require('../../generators/handledEntities/getHandledTestCommits');

describe('computeStatistics function tests', () => {
  test('return array with length like passed sprints', () => {
    const statistics = computeStatistics({
      sprints: [],
    });

    expect(statistics).toBeInstanceOf(Array);
  });

  test('returned array contain statisticsItems with only properties min, mid, max, extra', () => {
    const sprints = [];
    sprints.push(
      getHandledTestCommits({
        commitIds: [1],
        authorIds: [1],
        timestamps: [0],
      }),
    );

    const statistics = computeStatistics({
      sprints,
      commitSummaries: new Map([
        [
          1, [1, 2],
        ],
      ]),
      summaries: new Map([
        [
          1, { id: 1, value: 10 },
        ],
        [
          2, { id: 1, value: 150 },
        ],
      ]),
    });

    expect(statistics).toHaveLength(1);
    expect(statistics[0]).toStrictEqual({
      min: 0,
      mid: 1,
      max: 0,
      extra: 0,
    });
  });

  test('right compute statistics', () => {
    const sprints = [];
    sprints.push(
      getHandledTestCommits({
        commitIds: [1, 5],
        authorIds: [1],
        timestamps: [0],
      }),
      getHandledTestCommits({
        commitIds: [2],
        authorIds: [1],
        timestamps: [0],
      }),
      getHandledTestCommits({
        commitIds: [3],
        authorIds: [1],
        timestamps: [0],
      }),
      getHandledTestCommits({
        commitIds: [4],
        authorIds: [1],
        timestamps: [0],
      }),
    );

    const statistics = computeStatistics({
      sprints,
      commitSummaries: new Map([
        [
          1, [1, 2, 4],
        ],
        [
          2, [5],
        ],
        [
          3, [3, 7],
        ],
        [
          4, [6],
        ],
        [
          5, [8],
        ],
      ]),
      summaries: new Map([
        [
          1, { id: 1, value: 0 },
        ],
        [
          2, { id: 1, value: 150 },
        ],
        [
          3, { id: 1, value: 351 },
        ],
        [
          4, { id: 1, value: 150 },
        ],
        [
          5, { id: 1, value: 1001 },
        ],
        [
          6, { id: 1, value: 1 },
        ],
        [
          7, { id: 1, value: 350 },
        ],
        [
          8, { id: 1, value: 75 },
        ],
      ]),
    });

    expect(statistics).toHaveLength(4);
    expect(statistics).toStrictEqual([
      {
        min: 1,
        mid: 1,
        max: 0,
        extra: 0,
      },
      {
        min: 0,
        mid: 0,
        max: 0,
        extra: 1,
      },
      {
        min: 0,
        mid: 0,
        max: 1,
        extra: 0,
      },
      {
        min: 1,
        mid: 0,
        max: 0,
        extra: 0,
      },
    ]);
  });

  test('return right data if some commits have not summaries', () => {
    const sprints = [];
    sprints.push(
      getHandledTestCommits({
        commitIds: [1],
        authorIds: [1],
        timestamps: [0],
      }),
    );
    sprints.push(
      getHandledTestCommits({
        commitIds: [2],
        authorIds: [1],
        timestamps: [0],
      }),
    );

    const statistics = computeStatistics({
      sprints,
      commitSummaries: new Map([
        [
          1, [],
        ],
      ]),
      summaries: new Map(),
    });

    expect(statistics).toHaveLength(2);
    expect(statistics[0]).toStrictEqual({
      min: 1,
      mid: 0,
      max: 0,
      extra: 0,
    });
    expect(statistics[1]).toStrictEqual({
      min: 1,
      mid: 0,
      max: 0,
      extra: 0,
    });
  });

  test('return right data if there are not commits in sprint', () => {
    const sprints = [];
    sprints.push(
      getHandledTestCommits({
        commitIds: [],
        authorIds: [],
        timestamps: [],
      }),
    );

    const statistics = computeStatistics({
      sprints,
      commitSummaries: new Map(),
      summaries: new Map(),
    });

    expect(statistics).toHaveLength(1);
    expect(statistics[0]).toStrictEqual({
      min: 0,
      mid: 0,
      max: 0,
      extra: 0,
    });
  });
});
