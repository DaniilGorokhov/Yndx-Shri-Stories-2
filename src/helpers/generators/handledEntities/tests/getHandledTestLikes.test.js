const { getHandledTestLikes } = require('../getHandledTestLikes');

describe('getHandledTestLikes function tests', () => {
  test('return map (user.id as key, { timestamp, quantity }[] as value)', () => {
    const now = Date.now();
    const handledLikes = getHandledTestLikes({
      userIds: [1],
      likeItems: [
        [{ timestamp: now, quantity: 1 }],
      ],
    });

    expect(handledLikes).toBeInstanceOf(Map);
    expect(handledLikes.has(1)).toBeTruthy();
    expect(handledLikes.get(1)).toBeInstanceOf(Array);
    expect(handledLikes.get(1)[0]).toStrictEqual({
      timestamp: now,
      quantity: 1,
    });
  });

  test('return map with selected users and '
    + 'selected timestamps and quantities by property likeItems', () => {
    const now = Date.now();
    const handledLikes = getHandledTestLikes({
      userIds: [1, 2, 3],
      likeItems: [
        [{ timestamp: now + 1, quantity: 1 }, { timestamp: now, quantity: 2 }],
        [{ timestamp: now + 2, quantity: 3 }, { timestamp: now, quantity: 2 }],
        [{ timestamp: now + 3, quantity: 5 }, { timestamp: now, quantity: 2 }],
      ],
    });

    for (let userId = 1; userId < 4; userId += 1) {
      expect(handledLikes.get(userId)).toHaveLength(2);
      expect(handledLikes.get(userId)[0]).toStrictEqual({
        timestamp: now + userId,
        quantity: 2 * userId - 1,
      });
      expect(handledLikes.get(userId)[1]).toStrictEqual({
        timestamp: now,
        quantity: 2,
      });
    }
  });
});
