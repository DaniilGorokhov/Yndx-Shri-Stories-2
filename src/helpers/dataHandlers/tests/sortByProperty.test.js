const { sortByProperty } = require('../sortByProperty');

const {
  getHandledTestUsersWithValues,
} = require('../../generators/handledEntities/getHandledTestUsersWithValues');

describe('sortByProperty function tests', () => {
  test('do not return new array', () => {
    const userLikesArray = getHandledTestUsersWithValues({
      userIds: [1],
      valueTexts: ['10 голосов'],
    });

    expect(sortByProperty({
      array: userLikesArray,
      propertyForSort: 'valueText',
    })).toBeUndefined();
  });

  test('sort passed array by passed property of each object', () => {
    const userLikesArray = getHandledTestUsersWithValues({
      userIds: [1, 2, 3],
      valueTexts: ['10 голосов', '8 голосов', '6 голосов'],
    });

    sortByProperty({
      array: userLikesArray,
      propertyForSort: 'valueText',
    });

    const expectedResult = getHandledTestUsersWithValues({
      userIds: [3, 2, 1],
      valueTexts: ['6 голосов', '8 голосов', '10 голосов'],
    });

    expect(userLikesArray).toStrictEqual(expectedResult);
  });

  test('sort array in descending order, if passed parameter descending with value true', () => {
    const userLikesArray = getHandledTestUsersWithValues({
      userIds: [3, 2, 1],
      valueTexts: ['6 голосов', '8 голосов', '10 голосов'],
    });

    sortByProperty({
      array: userLikesArray,
      propertyForSort: 'valueText',
      descending: true,
    });

    const expectedResult = getHandledTestUsersWithValues({
      userIds: [1, 2, 3],
      valueTexts: ['10 голосов', '8 голосов', '6 голосов'],
    });

    expect(userLikesArray).toStrictEqual(expectedResult);
  });
});
