const { getHandledTestUsers } = require('../getHandledTestUsers');

describe('getHandledTestUsers function tests', () => {
  test('return map (user.id as key, user entity as value)', () => {
    const handledUsers = getHandledTestUsers({ userIds: [1] });

    expect(handledUsers).toBeInstanceOf(Map);
    expect(handledUsers.has(1)).toBeTruthy();
    expect(handledUsers.get(1)).toBeInstanceOf(Object);
  });

  test('returned user entity in map has only properties, that has handled user', () => {
    const handledUsers = getHandledTestUsers({ userIds: [1] });

    expect(handledUsers.get(1)).toStrictEqual({
      id: 1,
      name: 'test username1',
      avatar: '1.jpg',
    });
  });

  test('return map of user entities with selected user.id', () => {
    const handledUsers = getHandledTestUsers({ userIds: [1, 4, 7, 10] });

    for (let userId = 1; userId < 11; userId += 3) {
      expect(handledUsers.get(userId).id).toBe(userId);
    }
  });
});
