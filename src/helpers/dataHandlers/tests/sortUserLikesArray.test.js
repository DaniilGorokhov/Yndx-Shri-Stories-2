const { sortUserLikesArray } = require('../sortUserLikesArray');

const { getHandledTestUserLikes } = require('../../generators/handledEntities/getHandledTestUserLikes');

describe('sortUserLikesArray function tests', () => {
  test('not return new array', () => {
    const userLikesArray = getHandledTestUserLikes({
      userIds: [1],
      valueTexts: ['10 голосов'],
    });

    expect(sortUserLikesArray(userLikesArray)).toBeUndefined();
  });

  test('sort passed array by valueText property of each object', () => {
    const userLikesArray = getHandledTestUserLikes({
      userIds: [3, 2, 1],
      valueTexts: ['6 голосов', '8 голосов', '10 голосов'],
    });
    sortUserLikesArray(userLikesArray);

    const expectedResult = getHandledTestUserLikes({
      userIds: [1, 2, 3],
      valueTexts: ['10 голосов', '8 голосов', '6 голосов'],
    });

    expect(userLikesArray).toStrictEqual(expectedResult);
  });
});
