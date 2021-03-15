const { sortDescByValueText } = require('../sortDescByValueText');

const {
  getHandledTestUsersWithValues,
} = require('../../generators/handledEntities/getHandledTestUsersWithValues');

describe('sortUserLikesArray function tests', () => {
  test('do not return new array', () => {
    const userLikesArray = getHandledTestUsersWithValues({
      userIds: [1],
      valueTexts: ['10 голосов'],
    });

    expect(sortDescByValueText(userLikesArray)).toBeUndefined();
  });

  test('sort passed array by valueText property of each object', () => {
    const userLikesArray = getHandledTestUsersWithValues({
      userIds: [3, 2, 1],
      valueTexts: ['6 голосов', '8 голосов', '10 голосов'],
    });
    sortDescByValueText(userLikesArray);

    const expectedResult = getHandledTestUsersWithValues({
      userIds: [1, 2, 3],
      valueTexts: ['10 голосов', '8 голосов', '6 голосов'],
    });

    expect(userLikesArray).toStrictEqual(expectedResult);
  });

  test('if users have equal valueText, than users sort by id', () => {
    const userCommitsArray = getHandledTestUsersWithValues({
      userIds: [14, 25, 6, 8],
      valueTexts: ['10', '10', '10', '10'],
    });
    sortDescByValueText(userCommitsArray);

    const expectedResult = getHandledTestUsersWithValues({
      userIds: [6, 8, 14, 25],
      valueTexts: ['10', '10', '10', '10'],
    });

    expect(userCommitsArray).toStrictEqual(expectedResult);
  });
});
