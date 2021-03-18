const { computeHeatMap } = require('../computeHeatMap');

const { getTestSprint } = require('../../generators/getTestSprint');
const {
  getHandledTestCommits,
} = require('../../generators/handledEntities/getHandledTestCommits');

describe('computeHeatMap function tests', () => {
  test('return object only with properties mon, tue, wed, thu, fri, sat, sun', () => {
    const activeSprint = getTestSprint();
    const heatMapData = computeHeatMap([], activeSprint);

    expect(Object.keys(heatMapData)).toHaveLength(7);

    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (let dayIx = 0; dayIx < days.length; dayIx += 1) {
      expect(heatMapData).toHaveProperty(days[dayIx]);
    }
  });

  test('returned data corresponds to passed commits', () => {
    const activeSprint = getTestSprint();

    const timestamps = [ // comment consists of day and hour
      new Date(1616336316244), // sun 17
      new Date(1615151916244), // mon 0
      new Date(1614575916244), // mon 8
      new Date(1614683916244), // tue 14
      new Date(1616530716244), // tue 23
      new Date(1615947516244), // wed 5
      new Date(1614799116244), // wed 22
      new Date(1616051916244), // thu 10
      new Date(1616080716244), // thu 18
      new Date(1614903516244), // fri 3
      new Date(1616156316244), // fri 15
      new Date(1615022316244), // sat 12
    ];
    const activeCommits = getHandledTestCommits({
      commitIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      authorIds: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      timestamps,
    });

    const heatMapData = computeHeatMap(activeCommits, activeSprint);

    const expectedValues = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    for (let dayIx = 0; dayIx < days.length; dayIx += 1) {
      expect(heatMapData).toHaveProperty(days[dayIx], expectedValues[dayIx]);
    }
  });

  test('return right data if passed commits array is empty', () => {
    const activeSprint = getTestSprint();

    const heatMapData = computeHeatMap([], activeSprint);

    const value = [];
    for (let hourIx = 0; hourIx < 24; hourIx += 1) {
      value.push(0);
    }

    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    for (let dayIx = 0; dayIx < days.length; dayIx += 1) {
      expect(heatMapData).toHaveProperty(days[dayIx], value);
    }
  });
});
