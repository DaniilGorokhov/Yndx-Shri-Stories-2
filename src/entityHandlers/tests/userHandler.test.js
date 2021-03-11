const { users, userHandler } = require('../userHandler');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });
});

describe('userHandler tests', () => {
  function getTestUser({ startId = 1, friendsQuantity = 0, friendsIndexes = [] } = {}) {
    const friends = [];
    for (let friendIx = 0; friendIx < friendsQuantity; friendIx += 1) {
      const newStartId = friendsIndexes[friendIx] || startId + friendIx + 1;
      friends.push(getTestUser({ startId: newStartId }));
    }

    const user = {
      id: startId,
      name: `test username${startId}`,
      login: `testlogin${startId}`,
      avatar: `${startId}.jpg`,
      friends,
    };

    return user;
  }

  describe('handler returning', () => {
    test('type of user.id is a number', () => {
      const user = getTestUser();

      expect(typeof userHandler(user)).toBe('number');
    });

    test('handler return a passed user.id', () => {
      const user = getTestUser();

      expect(userHandler(user)).toBe(1);
    });
  });

  describe('handler saving', () => {
    test('user has saved', () => {
      const user = getTestUser();

      userHandler(user);
      expect(users.size).toBe(1);
    });

    test('passed user object did not change', () => {
      const user = getTestUser();
      const userCopy = Object.assign(user);

      userHandler(user);
      expect(user).toBe(userCopy);
    });

    test('login property did not save', () => {
      const user = getTestUser();

      userHandler(user);
      expect(users.get(user.id)).not.toHaveProperty('login');
    });

    describe('user.id property', () => {
      test('saved user has id property', () => {
        const user = getTestUser();

        userHandler(user);
        expect(users.get(user.id)).toHaveProperty('id');
      });

      test('saved user.id did not change', () => {
        const user = getTestUser();

        userHandler(user);
        expect(users.get(user.id)).toHaveProperty('id', 1);
      });
    });

    describe('user.name property', () => {
      test('saved user has name property', () => {
        const user = getTestUser();

        userHandler(user);
        expect(users.get(user.id)).toHaveProperty('name');
      });

      test('saved user.name did not change', () => {
        const user = getTestUser({ startId: 1 });

        userHandler(user);
        expect(users.get(user.id)).toHaveProperty('name', 'test username1');
      });
    });

    describe('user.avatar property', () => {
      test('saved user has avatar property', () => {
        const user = getTestUser();

        userHandler(user);
        expect(users.get(user.id)).toHaveProperty('avatar');
      });

      test('saved user.avatar did not changed', () => {
        const user = getTestUser({ startId: 1 });

        userHandler(user);
        expect(users.get(user.id)).toHaveProperty('avatar', '1.jpg');
      });
    });

    test('save user one time if pass one user twice', () => {
      const user = getTestUser();

      userHandler(user);
      userHandler(user);
      expect(users.size).toBe(1);
    });
  });

  describe('friends handling', () => {
    test('save users from friends property', () => {
      const user = getTestUser({ startId: 1, friendsQuantity: 2 });

      userHandler(user);
      expect(users.size).toBe(3);
    });

    test('ignore friends item if it is user.id', () => {
      const user = getTestUser({ startId: 1, friendsQuantity: 2 });
      user.friends.push(15);
      user.friends.push(1);
      user.friends.push(3);

      userHandler(user);
      expect(users.size).toBe(3);
    });
  });
});

// TODO do not rewrite user if pass one user twice
