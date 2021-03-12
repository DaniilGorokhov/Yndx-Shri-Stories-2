const { prepareData } = require('../index');
const { users } = require('../entityHandlers/userHandler');

const { getTestUser } = require('../helpers/getTestUser');
const { getTestComment } = require('../helpers/getTestComment');
const { getTestCommit } = require('../helpers/getTestCommit');
const { getTestIssue } = require('../helpers/getTestIssue');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });
});

describe('prepareData function tests', () => {
  test('throw error if entity type is invalid', () => {
    const obj = { type: 'Invalid' };

    expect(() => prepareData([obj], { sprintId: 1 })).toThrow('error');
  });

  describe('user entity handling', () => {
    test('save user when passed entity with type User', () => {
      const user = getTestUser();

      prepareData([user], { sprintId: 1 });
      expect(users.size).toBe(1);
    });

    test('save user when passed entity with type Comment with property author', () => {
      const comment = getTestComment();

      prepareData([comment], { sprintId: 1 });
      expect(users.size).toBe(1);
    });

    test('save users when passed entity with type Comment with likes property', () => {
      const comment = getTestComment({
        likes: [
          { userAsId: true, id: 2 },
          { id: 3 },
          4,
          5,
        ],
      });

      prepareData([comment], { sprintId: 1 });
      expect(users.size).toBe(4);
    });

    test('save user when passed entity with type Commit with property author', () => {
      const commit = getTestCommit();

      prepareData([commit], { sprintId: 1 });
      expect(users.size).toBe(1);
    });

    test('save user when passed entity with type Issue with property resolvedBy', () => {
      const issue = getTestIssue({
        resolvedBy: true,
      });

      prepareData([issue], { sprintId: 1 });
      expect(users.size).toBe(1);
    });
  });
});
