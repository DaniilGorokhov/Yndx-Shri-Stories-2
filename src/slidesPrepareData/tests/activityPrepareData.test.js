const { activityPrepareData } = require('../activityPrepareData');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');

describe('activityPrepareData function tests', () => {
  test('return object only with properties alias and data', () => {
    const activeSprint = getTestSprint();
    const activitySlideData = activityPrepareData({}, activeSprint);

    expect(Object.keys(activitySlideData)).toHaveLength(2);
    expect(activitySlideData).toHaveProperty('alias');
    expect(activitySlideData).toHaveProperty('data');
  });

  test('returned object.alias equal to \'activity\'', () => {
    const activeSprint = getTestSprint();
    const activitySlideData = activityPrepareData({}, activeSprint);

    expect(activitySlideData).toHaveProperty('alias', 'activity');
  });

  test('returned object.data has only properties title, subtitle, data', () => {
    const activeSprint = getTestSprint();
    const { data } = activityPrepareData({}, activeSprint);

    expect(Object.keys(data)).toHaveLength(3);
    expect(data).toHaveProperty('title', 'Коммиты');
    expect(data).toHaveProperty('subtitle', activeSprint.name);
    expect(data).toHaveProperty('data');
  });

  test('do not change passed heatMapData', () => {
    const activeSprint = getTestSprint();

    const heatMapData = {
      sun: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      mon: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      tue: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      wed: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      thu: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      fri: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      sat: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
    };

    const heatMapDataCopy = {};
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (let dayIx = 0; dayIx < days.length; dayIx += 1) {
      const day = days[dayIx];
      heatMapDataCopy[day] = [...heatMapData[day]];
    }

    activityPrepareData(heatMapData, activeSprint);

    expect(heatMapData).toStrictEqual(heatMapDataCopy);
  });

  test('returned object.data.data is passed heatMapData', () => {
    const activeSprint = getTestSprint();

    const heatMapData = {
      sun: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      mon: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      tue: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      wed: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      thu: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      fri: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      sat: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
    };

    const { data: { data } } = activityPrepareData(heatMapData, activeSprint);

    expect(data).toBe(heatMapData);
  });
});
