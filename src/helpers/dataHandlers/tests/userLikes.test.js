const { userLikes } = require('../userLikes');

const { getTestSprint } = require('../../generators/getTestSprint');
const { getHandledTestUsers } = require('../../generators/handledEntities/getHandledTestUsers');
const { getHandledTestLikes } = require('../../generators/handledEntities/getHandledTestLikes');

describe('userLikes function tests', () => {
  test('return array', () => {
    const now = Date.now();
    const activeSprint = getTestSprint({ startAt: now - 100000, finishAt: now });

    const users = getHandledTestUsers({ userIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });

    const likeItems = [];
    for (let likeMultiplier = 0; likeMultiplier < 10; likeMultiplier += 1) {
      likeItems.push([
        {
          timestamp: now - 10000,
          quantity: 10 * likeMultiplier,
        },
      ]);
    }
    const likes = getHandledTestLikes({
      userIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      likeItems,
    });

    const userLikesArray = userLikes(users, likes, activeSprint);

    expect(userLikesArray).toBeInstanceOf(Array);
  });

  test('return array of objects, that have right properties id, name, avatar, valueText', () => {
    const now = Date.now();
    const activeSprint = getTestSprint({ startAt: now - 100000, finishAt: now });

    const users = getHandledTestUsers({ userIds: [1, 2] });

    const likes = getHandledTestLikes({
      userIds: [1, 2],
      likeItems: [
        [{
          timestamp: now - 10000,
          quantity: 11,
        }],
        [{
          timestamp: now - 100,
          quantity: 25,
        }],
      ],
    });

    const userLikesArray = userLikes(users, likes, activeSprint);

    expect(userLikesArray).toStrictEqual([
      {
        id: 1,
        name: 'test username1',
        avatar: '1.jpg',
        valueText: '11 голосов',
      },
      {
        id: 2,
        name: 'test username2',
        avatar: '2.jpg',
        valueText: '25 голосов',
      },
    ]);
  });

  test('return right data when several likes are ignored, '
    + 'since their timestamps are strict less than activeSprint.startAt', () => {
    const now = Date.now();
    const activeSprint = getTestSprint({ startAt: now - 100000, finishAt: now });

    const users = getHandledTestUsers({ userIds: [1] });

    const likes = getHandledTestLikes({
      userIds: [1],
      likeItems: [
        [
          {
            timestamp: now - 200000,
            quantity: 2,
          },
          {
            timestamp: now - 100000,
            quantity: 6,
          },
        ],
      ],
    });

    const userLikesArray = userLikes(users, likes, activeSprint);

    expect(userLikesArray[0]).toHaveProperty('valueText', '6 голосов');
  });

  test('return right data when several likes are ignored, '
    + 'since their timestamps are strict greater than activeSprint.finishAt', () => {
    const now = Date.now();
    const activeSprint = getTestSprint({ startAt: now - 100000, finishAt: now });

    const users = getHandledTestUsers({ userIds: [1] });

    const likes = getHandledTestLikes({
      userIds: [1],
      likeItems: [
        [
          {
            timestamp: now,
            quantity: 2,
          },
          {
            timestamp: now + 100000,
            quantity: 6,
          },
        ],
      ],
    });

    const userLikesArray = userLikes(users, likes, activeSprint);

    expect(userLikesArray[0]).toHaveProperty('valueText', '2 голоса');
  });

  test('return right data when there are users, '
    + 'but there are not likes for them or user has 0 likes', () => {
    const now = Date.now();
    const activeSprint = getTestSprint({ startAt: now - 100000, finishAt: now });

    const users = getHandledTestUsers({ userIds: [1, 2, 3] });

    const likes = getHandledTestLikes({
      userIds: [2, 3],
      likeItems: [
        [],
        [{
          timestamp: now - 100000,
          quantity: 0,
        }],
      ],
    });

    const userLikesArray = userLikes(users, likes, activeSprint);

    expect(userLikesArray).toStrictEqual([
      {
        id: 1,
        name: 'test username1',
        avatar: '1.jpg',
        valueText: '0 голосов',
      },
      {
        id: 2,
        name: 'test username2',
        avatar: '2.jpg',
        valueText: '0 голосов',
      },
      {
        id: 3,
        name: 'test username3',
        avatar: '3.jpg',
        valueText: '0 голосов',
      },
    ]);
  });

  test('do not change passed users', () => {
    const now = Date.now();
    const activeSprint = getTestSprint({ startAt: now - 100000, finishAt: now });

    const users = getHandledTestUsers({ userIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });

    const likeItems = [];
    for (let likeMultiplier = 0; likeMultiplier < 10; likeMultiplier += 1) {
      likeItems.push([
        {
          timestamp: now - 10000,
          quantity: 10 * likeMultiplier,
        },
      ]);
    }
    const likes = getHandledTestLikes({
      userIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      likeItems,
    });

    const usersCopy = new Map();
    users.forEach((value, key) => usersCopy.set(key, value));

    userLikes(users, likes, activeSprint);

    expect(users).toStrictEqual(usersCopy);
  });

  test('do not change passed likes', () => {
    const now = Date.now();
    const activeSprint = getTestSprint({ startAt: now - 100000, finishAt: now });

    const users = getHandledTestUsers({ userIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });

    const likeItems = [];
    for (let likeMultiplier = 0; likeMultiplier < 10; likeMultiplier += 1) {
      likeItems.push([
        {
          timestamp: now - 10000,
          quantity: 10 * likeMultiplier,
        },
      ]);
    }
    const likes = getHandledTestLikes({
      userIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      likeItems,
    });

    const likesCopy = new Map();
    likes.forEach((value, key) => likesCopy.set(key, value));

    userLikes(users, likes, activeSprint);

    expect(likes).toStrictEqual(likesCopy);
  });
});
