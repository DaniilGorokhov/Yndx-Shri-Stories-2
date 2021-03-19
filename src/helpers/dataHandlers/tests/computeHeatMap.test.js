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
    const activeSprint = getTestSprint({
      startAt: 1615755600000,
      finishAt: 1616360399999,
    });

    const timestamps = [ // comment consists of day and hour
      new Date(1616347116244), // sun 20
      // new Date(1615162716244), // mon 3
      // new Date(1614586716244), // mon 11
      // new Date(1614694716244), // tue 17
      // new Date(1616541516244), // wed 2
      new Date(1615958316244), // wed 8
      // new Date(1614809916244), // thu 1
      // new Date(1616062716244), // thu 13
      // new Date(1616091516244), // thu 21
      // new Date(1614914316244), // fri 6
      // new Date(1616167116244), // fri 18
      // new Date(1615033116244), // sat 15
    ];
    const activeCommits = getHandledTestCommits({
      commitIds: [0, 1],
      authorIds: [1, 1],
      // commitIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      // authorIds: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      timestamps,
    });

    const heatMapData = computeHeatMap(activeCommits, activeSprint);

    const expectedValues = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    ];

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

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
