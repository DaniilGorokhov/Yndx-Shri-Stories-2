const { getHandledTestUsersWithValues } = require('../getHandledTestUsersWithValues');

describe('getHandledTestUsersWithValues function tests', () => {
  test('return array', () => {
    const handledUserLikesArray = getHandledTestUsersWithValues();

    expect(handledUserLikesArray).toBeInstanceOf(Array);
  });

  test('return new array with new objects each call', () => {
    const handledUserLikesArray = getHandledTestUsersWithValues({ userIds: [1], valueTexts: ['1'] });
    const handledUserLikesArrayAgain = getHandledTestUsersWithValues({ userIds: [1], valueTexts: ['1'] });

    expect(handledUserLikesArray).not.toBe(handledUserLikesArrayAgain);
    expect(handledUserLikesArray[0]).not.toBe(handledUserLikesArrayAgain[0]);
  });

  test('returned array contains object with selected user.ids and valuesTexts', () => {
    const handledUserLikesArray = getHandledTestUsersWithValues({
      userIds: [4, 3, 2, 5],
      valueTexts: ['24 голоса', '48 голосов', '21 голос', '11 голосов'],
    });

    expect(handledUserLikesArray).toStrictEqual([
      {
        id: 4,
        name: 'test username4',
        avatar: '4.jpg',
        valueText: '24 голоса',
      },
      {
        id: 3,
        name: 'test username3',
        avatar: '3.jpg',
        valueText: '48 голосов',
      },
      {
        id: 2,
        name: 'test username2',
        avatar: '2.jpg',
        valueText: '21 голос',
      },
      {
        id: 5,
        name: 'test username5',
        avatar: '5.jpg',
        valueText: '11 голосов',
      },
    ]);
  });
});
