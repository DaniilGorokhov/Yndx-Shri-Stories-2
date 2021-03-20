const { users, userHandler } = require('../userHandler');

const { getTestUser } = require('../../helpers/generators/getTestUser');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });
});

describe('userHandler function tests', () => {
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
    test('save user in users map', () => {
      const user = getTestUser();

      userHandler(user);
      expect(users.size).toBe(1);
    });

    test('do not change passed user object', () => {
      const user = getTestUser();
      const userCopy = { ...user };

      userHandler(user);
      expect(user).toStrictEqual(userCopy);
    });

    test('do not save login property', () => {
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
        const user = getTestUser();

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
        const user = getTestUser({ userId: 1 });

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
});
