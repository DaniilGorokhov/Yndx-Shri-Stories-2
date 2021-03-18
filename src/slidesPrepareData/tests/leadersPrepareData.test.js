const { leadersPrepareData } = require('../leadersPrepareData');

const { getTestSprint } = require('../../helpers/generators/getTestSprint');
const {
  getHandledTestUsersWithValues,
} = require('../../helpers/generators/handledEntities/getHandledTestUsersWithValues');

describe('leadersPrepareData function tests', () => {
  test('return object only with properties alias and data', () => {
    const activeSprint = getTestSprint({ active: true });
    const userCommitsArray = getHandledTestUsersWithValues();
    const leadersSlideData = leadersPrepareData(userCommitsArray, activeSprint);

    expect(leadersSlideData).toHaveProperty('alias');
    expect(leadersSlideData).toHaveProperty('data');
    expect(Object.keys(leadersSlideData)).toHaveLength(2);
  });

  test('returned object has property alias with value \'leaders\'', () => {
    const activeSprint = getTestSprint({ active: true });
    const userCommitsArray = getHandledTestUsersWithValues();
    const leadersSlideData = leadersPrepareData(userCommitsArray, activeSprint);

    expect(leadersSlideData.alias).toBe('leaders');
  });

  test('returned object.data has only properties title, subtitle, emoji and users', () => {
    const activeSprint = getTestSprint({ active: true });
    const userCommitsArray = getHandledTestUsersWithValues();
    const leadersSlideData = leadersPrepareData(userCommitsArray, activeSprint);

    expect(leadersSlideData.data).toHaveProperty('title', 'Больше всего коммитов');
    expect(leadersSlideData.data).toHaveProperty('subtitle', activeSprint.name);
    expect(leadersSlideData.data).toHaveProperty('emoji', '👑');
    expect(leadersSlideData.data).toHaveProperty('users', []);
  });

  test('returned object.data.users is strict equal to passed userCommits', () => {
    const activeSprint = getTestSprint({ active: true });
    const userCommitsArray = getHandledTestUsersWithValues({
      userIds: [1, 2, 5],
      valueTexts: ['24', '16', '8'],
    });
    const leadersSlideData = leadersPrepareData(userCommitsArray, activeSprint);

    expect(leadersSlideData.data.users).toStrictEqual(userCommitsArray);
  });
});
