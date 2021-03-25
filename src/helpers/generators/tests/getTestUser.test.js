const { getTestUser } = require('../getTestUser');
const { getTestComment } = require('../getTestComment');
const { getTestCommit } = require('../getTestCommit');

describe('getTestUser function tests', () => {
  test('return user object', () => {
    const user = getTestUser();

    expect(user).toStrictEqual({
      id: 1,
      type: 'User',
      name: 'test username1',
      login: 'testlogin1',
      avatar: '1.jpg',
      friends: [],
    });
  });

  test('return new object each call', () => {
    const user = getTestUser();
    user.name = 'test username2';

    const userAgain = getTestUser();

    expect(user.name).not.toBe(userAgain.name);
  });

  test('return user with selected id', () => {
    const user = getTestUser({ userId: 5 });

    expect(user).toStrictEqual({
      id: 5,
      type: 'User',
      name: 'test username5',
      login: 'testlogin5',
      avatar: '5.jpg',
      friends: [],
    });
  });

  test('return user with selected user name', () => {
    const user = getTestUser({ name: 'Oleg' });

    expect(user.name).toBe('Oleg');
  });

  test('when passed id and name, user.name is passed name (not test name with id)', () => {
    const user = getTestUser({
      userId: 2,
      name: 'Oleg',
    });

    expect(user.id).toBe(2);
    expect(user.name).toBe('Oleg');
  });

  test('return user with selected friends quantity', () => {
    const user = getTestUser({ friendsQuantity: 3 });

    expect(user.friends).toHaveLength(3);
  });

  test('returned user.friends are distinct users', () => {
    const user = getTestUser({ friendsQuantity: 2 });

    expect(user.friends[0]).not.toStrictEqual(user.friends[1]);
  });

  test('return user.friends with selected friends id', () => {
    const user = getTestUser({ friendsQuantity: 2, friendsIndexes: [6, 7] });

    expect(user.friends[0].id).toBe(6);
    expect(user.friends[1].id).toBe(7);
  });

  test('return user.friends with user.id instead of entire user object '
   + 'if passed in friendsIndexes array object with property userAsId', () => {
    const user = getTestUser({
      friendsQuantity: 2,
      friendsIndexes: [
        { id: 6, userAsId: true },
        { id: 7, userAsId: true },
      ],
    });

    expect(user.friends[0]).toBe(6);
    expect(user.friends[1]).toBe(7);
  });

  test('return user.friends with user.id instead of entire user object '
   + 'if passed in friendsIndexes array object only with property id', () => {
    const user = getTestUser({
      friendsQuantity: 2,
      friendsIndexes: [
        { id: 6 },
        { id: 7 },
      ],
    });

    expect(user.friends[0].id).toBe(6);
    expect(user.friends[1].id).toBe(7);
  });

  test('return user with comments as a array if they passed', () => {
    const comment = getTestComment();
    const user = getTestUser({ comments: true, commentsItems: [comment] });

    expect(user.comments).toHaveLength(1);
    expect(user.comments[0]).toStrictEqual(comment);
  });

  test('return user with commits as a array if they passed', () => {
    const commits = [];
    for (let commitIx = 0; commitIx < 5; commitIx += 1) {
      commits.push(getTestCommit({ commitId: `${commitIx}11-x` }));
    }
    const user = getTestUser({ commits: true, commitsItems: commits });

    expect(user.commits).toStrictEqual(commits);
  });
});
