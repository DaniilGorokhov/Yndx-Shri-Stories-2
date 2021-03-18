const { votePrepareData } = require('../votePrepareData');

const {
  getHandledTestUsersWithValues,
} = require('../../helpers/generators/handledEntities/getHandledTestUsersWithValues');
const { getTestSprint } = require('../../helpers/generators/getTestSprint');

describe('votePrepareData function tests', () => {
  test('return object only with properties alias and data', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint({ active: true });

    const voteSlideData = votePrepareData(userLikes, activeSprint);

    expect(voteSlideData).toHaveProperty('alias');
    expect(voteSlideData).toHaveProperty('data');
    expect(Object.keys(voteSlideData)).toHaveLength(2);
  });

  test('returned object has property alias with value \'vote\'', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint({ active: true });

    const voteSlideData = votePrepareData(userLikes, activeSprint);

    expect(voteSlideData).toHaveProperty('alias', 'vote');
  });

  test('returned object.data has properties title, subtitle and emoji with right values', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint({ active: true });

    const voteSlideData = votePrepareData(userLikes, activeSprint);

    expect(voteSlideData.data).toHaveProperty('title', 'Самый 🔎 внимательный разработчик');
    expect(voteSlideData.data).toHaveProperty('subtitle', activeSprint.name);
    expect(voteSlideData.data).toHaveProperty('emoji', '🔎');
  });

  test('returned object.data has property users as array', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint({ active: true });

    const voteSlideData = votePrepareData(userLikes, activeSprint);

    expect(voteSlideData.data).toHaveProperty('users');
    expect(voteSlideData.data.users).toBeInstanceOf(Array);
  });

  test('returned object.data.users contains entire passed users', () => {
    const userLikes = getHandledTestUsersWithValues({
      userIds: [10, 7, 1, 2],
      valueTexts: ['48 голосов', '41 голос', '39 голосов', '12 голосов'],
    });
    const activeSprint = getTestSprint({ active: true });

    const voteSlideData = votePrepareData(userLikes, activeSprint);

    expect(voteSlideData.data.users).toStrictEqual(userLikes);
  });
});
