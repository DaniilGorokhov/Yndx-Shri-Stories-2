const { votePrepareData } = require('../votePrepareData');

const {
  getHandledTestUsersWithValues,
} = require('../../helpers/generators/handledEntities/getHandledTestUsersWithValues');
const { getTestSprint } = require('../../helpers/generators/getTestSprint');

describe('votePrepareData tests', () => {
  test('return object with two property: alias and data', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint();

    const prepareData = votePrepareData(userLikes, activeSprint);

    expect(prepareData).toHaveProperty('alias');
    expect(prepareData).toHaveProperty('data');
  });

  test('returned object has property alias with value \'vote\'', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint();

    const prepareData = votePrepareData(userLikes, activeSprint);

    expect(prepareData).toHaveProperty('alias', 'vote');
  });

  test('returned object.data has properties title, subtitle and emoji with right values', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint();

    const prepareData = votePrepareData(userLikes, activeSprint);

    expect(prepareData.data).toHaveProperty('title', 'Самый 🔎 внимательный разработчик');
    expect(prepareData.data).toHaveProperty('subtitle', activeSprint.name);
    expect(prepareData.data).toHaveProperty('emoji', '🔎');
  });

  test('returned object.data has property users as array', () => {
    const userLikes = getHandledTestUsersWithValues();
    const activeSprint = getTestSprint();

    const prepareData = votePrepareData(userLikes, activeSprint);

    expect(prepareData.data).toHaveProperty('users');
    expect(prepareData.data.users).toBeInstanceOf(Array);
  });

  test('returned object.data.users contains entire passed users', () => {
    const userLikes = getHandledTestUsersWithValues({
      userIds: [10, 7, 1, 2],
      valueTexts: ['48 голосов', '41 голос', '39 голосов', '12 голосов'],
    });
    const activeSprint = getTestSprint();

    const prepareData = votePrepareData(userLikes, activeSprint);

    expect(prepareData.data.users).toStrictEqual(userLikes);
  });
});
