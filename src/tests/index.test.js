const { prepareData } = require('../index');
const { users } = require('../entityHandlers/userHandler');
const { likes } = require('../entityHandlers/commentHandler');
const { sprints } = require('../entityHandlers/sprintHandler');
const { commits, commitSummaries } = require('../entityHandlers/commitHandler');
const { summaries } = require('../entityHandlers/summaryHandler');

const { getTestUser } = require('../helpers/generators/getTestUser');
const { getTestComment } = require('../helpers/generators/getTestComment');
const { getTestCommit } = require('../helpers/generators/getTestCommit');
const { getTestIssue } = require('../helpers/generators/getTestIssue');
const { getTestSummary } = require('../helpers/generators/getTestSummary');
const { getTestSprint } = require('../helpers/generators/getTestSprint');
const { getTestProject } = require('../helpers/generators/getTestProject');

const {
  getHandledTestUsersWithValues,
} = require('../helpers/generators/handledEntities/getHandledTestUsersWithValues');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });

  likes.forEach((value, key) => {
    likes.delete(key);
  });

  while (sprints.length) sprints.pop();

  while (commits.length) commits.pop();
  commitSummaries.forEach((value, key) => {
    commitSummaries.delete(key);
  });

  summaries.forEach((value, key) => {
    summaries.delete(key);
  });
});

describe('prepareData (slide data) function tests', () => {
  test('return right data for vote slide', () => {
    const sprintsToTest = [];
    for (let sprintId = 0; sprintId < 5; sprintId += 1) {
      sprintsToTest.push(getTestSprint({
        sprintId,
        startAt: sprintId * 1000,
        finishAt: sprintId * 1000 + 100,
      }));
    }

    const comments = [];
    for (let commentId = 0; commentId < 20; commentId += 1) {
      let createdAt;
      if (commentId <= 5) {
        createdAt = 10;
      } else if (commentId < 19) {
        createdAt = 1010;
      } else {
        createdAt = 1200;
      }

      let author;
      if (commentId === 0) {
        author = getTestUser({ userId: 10 });
      } else {
        author = commentId % 10;
      }

      const likesToTest = [];
      if (commentId === 1) {
        likesToTest.push(getTestUser({ userId: 11 }));
      } else {
        likesToTest.push(1);
      }
      if (commentId === 10) {
        likesToTest.push(getTestUser({ userId: 20 }));
      } else if (commentId >= 10) {
        likesToTest.push(1);
      }

      comments.push(getTestComment({
        commentId: `${commentId}11-x`,
        author,
        createdAt,
        likes: likesToTest,
      }));
    }

    const usersToTest = [];
    for (let userId = 0; userId < 10; userId += 1) {
      let user;
      if (userId === 3) {
        user = getTestUser({
          userId,
          comments: true,
          commentsItems: comments.slice(10, 15),
        });
      } else if (userId === 0) {
        user = getTestUser({
          userId,
          friendsQuantity: 2,
          friendsIndexes: [18, 19, { id: 20, userAsId: true }],
        });
      } else {
        user = getTestUser({ userId });
      }

      usersToTest.push(user);
    }

    const summariesToTest = [];
    for (let summaryId = 0; summaryId <= 5; summaryId += 1) {
      let summary;
      if (summaryId === 2) {
        summary = getTestSummary({
          summaryId,
          comments: true,
          commentsItems: [...comments.slice(18, 20), '111-x'],
        });
      } else {
        summary = getTestSummary({ summaryId });
      }

      summariesToTest.push(summary);
    }

    const issuesToTest = [];
    for (let issueId = 0; issueId < 5; issueId += 1) {
      let issue;
      if (issueId === 0) {
        issue = getTestIssue({
          issueId: `${issueId}abc`,
          resolvedBy: true,
          resolvedByUser: getTestUser({ userId: 12 }),
        });
      } else if (issueId === 1) {
        issue = getTestIssue({
          issueId: `${issueId}abc`,
          comments: [...comments.slice(15, 17), '111-x'],
        });
      } else {
        issue = getTestIssue({
          issueId: `${issueId}abc`,
          resolvedBy: true,
          resolvedByUser: issueId,
        });
      }

      issuesToTest.push(issue);
    }

    const commitsToTest = [];
    for (let commitId = 0; commitId < 6; commitId += 1) {
      let commit;
      if (commitId < 5) {
        commit = getTestCommit({
          commitId: `${commitId}11-x`,
          author: getTestUser({ userId: 13 + commitId }),
        });
      } else {
        commit = getTestCommit({
          commitId: `${commitId}11-x`,
          author: 10,
        });
      }

      commitsToTest.push(commit);
    }

    const comment = getTestComment({
      commentId: '20111-x',
      // in author property purposely should be user entity
      author: getTestUser({ userId: 10 }),
      likes: [0],
      createdAt: 1050,
    });
    const issue = getTestIssue({
      issueId: '5abc',
      comments: [comment],
    });
    const project = getTestProject({
      projectId: '111-x',
      issues: [issue],
    });
    const projectsToTest = [project];

    const entities = [
      ...sprintsToTest,
      ...comments.slice(0, 10),
      ...comments.slice(17, 19),
      ...usersToTest,
      ...summariesToTest,
      ...issuesToTest,
      ...commitsToTest,
      ...projectsToTest,
    ];
    const slidesPreparedData = prepareData(
      entities,
      { sprintId: 1 },
    );

    const expectedUsers = getHandledTestUsersWithValues({
      // When values are equal, user will be 'greater' if person has appeared earlier.
      // Order related to user appearance in data.
      userIds: [8, 6, 7, 0, 1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      valueTexts: [
        '5 голосов',
        '3 голоса',
        '3 голоса',
        '2 голоса',
        '2 голоса',
        '2 голоса',
        '2 голоса',
        '2 голоса',
        '2 голоса',
        '1 голос',
        '1 голос',
        '0 голосов',
        '0 голосов',
        '0 голосов',
        '0 голосов',
        '0 голосов',
        '0 голосов',
        '0 голосов',
        '0 голосов',
        '0 голосов',
        '0 голосов',
      ],
    });

    expect(slidesPreparedData[1]).toStrictEqual({
      alias: 'vote',
      data: {
        title: 'Самый 🔎 внимательный разработчик',
        subtitle: 'test sprint name1',
        emoji: '🔎',
        users: expectedUsers,
      },
    });
  });

  test('return right data for leaders slide', () => {
    const sprintsToTest = [];
    for (let sprintId = 0; sprintId < 5; sprintId += 1) {
      sprintsToTest.push(getTestSprint({
        sprintId,
        startAt: 1001 + sprintId * 100,
        finishAt: 1000 + (sprintId + 1) * 100,
      }));
    }

    const commitsToTest = [];
    for (let commitIx = 0; commitIx < 50; commitIx += 1) {
      const commit = getTestCommit({
        commitId: `${commitIx}11-x`,
        author: commitIx % 5,
        // in active sprint will be commitsToTest.slice(21, 41)
        timestamp: 1100 + 5 * commitIx,
      });

      if (commitIx === 38 || commitIx === 39) {
        commit.author = getTestUser({
          userId: 5 + (commitIx - 38),
          commits: true,
          commitsItems: [
            getTestCommit({
              commitId: 50 + (commitIx - 38),
              author: 5 + (commitIx - 38),
              timestamp: 1100 + 5 * commitIx,
            }),
          ],
        });
      }

      commitsToTest.push(commit);
    }

    const usersToTest = [];
    for (let userIx = 0; userIx < 5; userIx += 1) {
      const user = getTestUser({
        userId: userIx,
      });

      if (userIx === 1) {
        user.commits = [
          ...commitsToTest.slice(0, 10),
          ...commitsToTest.slice(30, 35),
        ];
      }

      if (userIx === 0) {
        user.friends.push(getTestUser({ userId: 8 }));
      }

      usersToTest.push(user);
    }

    const commentWithLikes = getTestComment({
      commentId: '111-x',
      likes: [
        getTestUser({ userId: 10 }),
      ],
    });

    const commentWithAuthor = getTestComment({
      commentId: '211-x',
      author: getTestUser({ userId: 9 }),
    });

    const commentsToTest = [commentWithLikes, commentWithAuthor];

    const project1 = getTestProject({
      projectId: '111-x',
      dependenciesConfig: [
        {
          projectId: '211-x',
          commits: [
            ...commitsToTest.slice(35, 38),
            ...commitsToTest.slice(45, 50),
          ],
        },
      ],
    });
    const project2 = getTestProject({
      projectId: '311-x',
      commits: commitsToTest.slice(40, 45),
    });

    const projectsToTest = [project1, project2];

    const issuesToTest = [];
    for (let issueIx = 0; issueIx < 5; issueIx += 1) {
      const issue = getTestIssue({
        issueId: `${issueIx}11-x`,
      });

      if (issueIx === 4) {
        issue.resolvedBy = getTestUser({ userId: 7 });
      }

      issuesToTest.push(issue);
    }

    const entities = [
      ...sprintsToTest,
      ...usersToTest,
      ...commitsToTest.slice(10, 30),
      ...commitsToTest.slice(38, 40),
      ...projectsToTest,
      ...commentsToTest,
      ...issuesToTest,
    ];

    const slidesPreparedData = prepareData(
      entities,
      { sprintId: 2 },
    );

    const expectedUsers = getHandledTestUsersWithValues({
      userIds: [
        // Order related to appearance of users in data
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ],
      valueTexts: [
        '4', '4', '4', '3', '3', '2', '2', '0', '0', '0', '0',
      ],
    });

    expect(slidesPreparedData[0]).toStrictEqual({
      alias: 'leaders',
      data: {
        title: 'Больше всего коммитов',
        subtitle: sprintsToTest[2].name,
        emoji: '👑',
        users: expectedUsers,
      },
    });
  });

  test('return right data for chart slide', () => {
    const sprintsToTest = [];
    for (let sprintId = 0; sprintId < 10; sprintId += 1) {
      const sprint = getTestSprint({
        sprintId,
        startAt: 1000 + 25 * sprintId,
        finishAt: 999 + 25 * (sprintId + 1),
      });

      if (sprintId === 1) {
        sprint.active = true;
      }

      sprintsToTest.push(sprint);
    }

    const commitsToTest = [];
    for (let commitIx = 0; commitIx < 60; commitIx += 1) {
      const commit = getTestCommit({
        commitId: `${commitIx}11-x`,
        timestamp: 1000 + 5 * commitIx,
        author: commitIx % 10,
      });

      if (commitIx >= 50) {
        commit.timestamp = 1048;
      }

      if (commitIx === 0) {
        const author = getTestUser({
          userId: 2,
        });

        commit.author = author;
      } else if (commitIx === 1) {
        commit.author = 9;
      } else if (commitIx === 2) {
        commit.author = 3;
      }

      commitsToTest.push(commit);
    }

    const issuesToTest = [];
    for (let issueIx = 0; issueIx < 5; issueIx += 1) {
      const issue = getTestIssue({
        issueId: `${issueIx}abc`,
      });

      if (issueIx === 1 || issueIx === 2) {
        const user = getTestUser({ userId: issueIx - 1 });

        issue.resolvedBy = user;
      }

      issuesToTest.push(issue);
    }

    const projectsToTest = [];
    for (let projectIx = 0; projectIx < 3; projectIx += 1) {
      const project = getTestProject({
        projectId: `${projectIx}11-x`,
      });

      if (projectIx === 1) {
        project.issues = issuesToTest.slice(0, 2);
      }

      if (projectIx === 2) {
        project.commits = commitsToTest.slice(0, 10);
      }

      projectsToTest.push(project);
    }

    const commentsToTest = [];
    for (let commentIx = 0; commentIx < 3; commentIx += 1) {
      const author = getTestUser({
        userId: 3 + commentIx,
      });

      const comment = getTestComment({
        commentId: `${commentIx}11-x`,
        author,
      });

      commentsToTest.push(comment);
    }

    const usersToTest = [];
    for (let userId = 6; userId < 8; userId += 1) {
      let user;
      if (userId === 6) {
        user = getTestUser({
          userId,
          commits: true,
          commitsItems: [commitsToTest[16], commitsToTest[26], 36],
        });
      } else {
        user = getTestUser({
          userId,
          friendsQuantity: 2,
          friendsIndexes: [8, 9],
        });
      }

      usersToTest.push(user);
    }

    const entities = [
      ...issuesToTest.slice(2, 5),
      ...projectsToTest,
      ...sprintsToTest,
      ...commitsToTest.slice(10, 16),
      ...commitsToTest.slice(17, 26),
      ...commitsToTest.slice(27, 60),
      ...usersToTest,
      ...commentsToTest,
    ];

    const slidesPreparedData = prepareData(
      entities,
      { sprintId: 1 },
    );

    const expectedValues = [];
    for (let valueIx = 0; valueIx < 10; valueIx += 1) {
      const value = {
        hint: `test sprint name${valueIx}`,
        title: valueIx.toString(),
      };

      if (valueIx === 1) {
        value.active = true;
        value.value = 15;
      } else {
        value.value = 5;
      }

      expectedValues.push(value);
    }

    const expectedUsers = getHandledTestUsersWithValues({
      // Order related to appearance of users in data TODO clear
      userIds: [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
      valueTexts: ['2', '2', '2', '2', '2', '1', '1', '1', '1', '1'],
    });

    expect(slidesPreparedData[2]).toStrictEqual({
      alias: 'chart',
      data: {
        title: 'Коммиты',
        subtitle: sprintsToTest[1].name,
        values: expectedValues,
        users: expectedUsers,
      },
    });
  });

  test('return right data for diagram slide', () => {
    const sprintsToTest = [];
    for (let sprintId = 0; sprintId < 3; sprintId += 1) {
      const sprint = getTestSprint({
        sprintId,
        startAt: sprintId * 1000,
        finishAt: sprintId * 1000 + 999,
      });

      sprintsToTest.push(sprint);
    }

    const summariesToTest = [];
    for (let summaryId = 0; summaryId < 100; summaryId += 1) {
      const summary = getTestSummary({
        summaryId,
        added: summaryId * 3,
        removed: summaryId,
      }); // previous: 25mid, active: 13mid, 12max

      summariesToTest.push(summary);
    }

    const commitsToTest = [];
    for (let commitIx = 0; commitIx < 50; commitIx += 1) {
      const commit = getTestCommit({
        commitId: `${commitIx}11-x`,
        summaries: [commitIx, 50 + commitIx],
        timestamp: 40 * commitIx,
      });

      if (commitIx >= 40) {
        commit.summaries = commit.summaries.map((summaryId) => summariesToTest[summaryId]);
      }

      commitsToTest.push(commit);
    }

    // Below we add user as author of comment, that is related to issue, that related to project
    const userToTest = getTestUser({
      userId: 0,
      commits: true,
      commitsItems: commitsToTest.slice(5, 10),
    });
    const comment = getTestComment({
      author: userToTest,
    });
    const issue = getTestIssue({
      comments: [comment],
    });
    const projectsToTest = [];
    for (let projectIx = 0; projectIx < 5; projectIx += 1) {
      const project = getTestProject({
        projectId: `${projectIx}11-x`,
        commits: [commitsToTest[projectIx]],
      });

      if (projectIx === 0) {
        project.issues = [issue];
      }

      projectsToTest.push(project);
    }

    const usersToTest = [];
    for (let userId = 1; userId < 11; userId += 1) {
      const user = getTestUser({
        userId,
        commits: true,
        commitsItems: [commitsToTest[9 + userId]],
      });

      usersToTest.push(user);
    }

    const entities = [
      ...projectsToTest,
      ...sprintsToTest,
      ...summariesToTest.slice(0, 40),
      ...summariesToTest.slice(50, 90),
      ...commitsToTest.slice(20, 50),
      ...usersToTest,
    ];

    const slidesPreparedData = prepareData(
      entities,
      { sprintId: 1 },
    );

    const expectedTotalText = '25 коммитов';
    const expectedDifferenceText = '0 с прошлого спринта';
    const expectedCategories = [
      {
        title: '> 1001 строки',
        valueText: '0 коммитов',
        differenceText: '0 коммитов',
      },
      {
        title: '501 — 1000 строк',
        valueText: '12 коммитов',
        differenceText: '+12 коммитов',
      },
      {
        title: '101 — 500 строк',
        valueText: '13 коммитов',
        differenceText: '-12 коммитов',
      },
      {
        title: '1 — 100 строк',
        valueText: '0 коммитов',
        differenceText: '0 коммитов',
      },
    ];

    expect(slidesPreparedData[3]).toStrictEqual({
      alias: 'diagram',
      data: {
        title: 'Размер коммитов',
        subtitle: sprintsToTest[1].name,
        totalText: expectedTotalText,
        differenceText: expectedDifferenceText,
        categories: expectedCategories,
      },
    });
  });

  test('return right data for activity slide', () => {
    const sprintsToTest = [];
    for (let sprintId = 0; sprintId < 10; sprintId += 1) {
      const sprint = getTestSprint({
        sprintId,
        startAt: sprintId * (7 * 24 * 60 * 60 * 1000),
        finishAt: (sprintId + 1) * (7 * 24 * 60 * 60 * 1000 - 1),
      });

      sprintsToTest.push(sprint);
    }

    const commitsToTest = [];
    for (let commitIx = 0; commitIx < 350; commitIx += 1) {
      const commit = getTestCommit({
        commitId: `${commitIx}11-x`,
        timestamp: commitIx * 4.8 * 60 * 60 * 1000,
      });

      commitsToTest.push(commit);
    }

    const usersToTest = [];
    for (let userId = 0; userId < 20; userId += 1) {
      const user = getTestUser({
        userId,
        commits: true,
        commitsItems: [
          commitsToTest[userId + 30],
        ],
      });

      usersToTest.push(user);
    }

    usersToTest[10].friends = usersToTest.slice(11);

    const comment = getTestComment({
      likes: [usersToTest[10]],
    });
    const issue = getTestIssue({
      comments: [comment],
    });
    const projectToTest = getTestProject({
      projectId: 10,
      issues: [issue],
    });

    const projectsToTest = [projectToTest];
    for (let projectIx = 0; projectIx < 10; projectIx += 1) {
      const project = getTestProject({
        projectId: `${projectIx}11-x`,
        commits: [
          commitsToTest[projectIx],
          commitsToTest[projectIx + 10],
          commitsToTest[projectIx + 20],
        ],
      });

      projectsToTest.push(project);
    }

    const entities = [
      ...sprintsToTest,
      ...commitsToTest.slice(50, 350),
      ...usersToTest.slice(0, 10),
      ...projectsToTest,
    ];

    const slidesPreparedData = prepareData(
      entities,
      { sprintId: 3 },
    );

    const expectedHeatMapData = {
      sun: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      mon: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      tue: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      wed: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      thu: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      fri: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      sat: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    };

    expect(slidesPreparedData[4]).toStrictEqual({
      alias: 'activity',
      data: {
        title: 'Коммиты',
        subtitle: sprintsToTest[3].name,
        data: expectedHeatMapData,
      },
    });
  });
});

test('return right data with empty sprint', () => {
  const sprint = getTestSprint({
    name: 'Спринт № 213',
  });

  const slidesPreparedData = prepareData([sprint], { sprintId: 1 });

  expect(slidesPreparedData).toStrictEqual([
    {
      alias: 'leaders',
      data: {
        title: 'Больше всего коммитов',
        subtitle: sprint.name,
        emoji: '👑',
        users: [],
      },
    },
    {
      alias: 'vote',
      data: {
        title: 'Самый 🔎 внимательный разработчик',
        subtitle: sprint.name,
        emoji: '🔎',
        users: [],
      },
    },
    {
      alias: 'chart',
      data: {
        title: 'Коммиты',
        subtitle: sprint.name,
        values: [
          {
            title: '1',
            hint: sprint.name,
            value: 0,
            active: true,
          },
        ],
        users: [],
      },
    },
    {
      alias: 'diagram',
      data: {
        title: 'Размер коммитов',
        subtitle: sprint.name,
        totalText: '0 коммитов',
        differenceText: '0 с прошлого спринта',
        categories: [
          { title: '> 1001 строки', valueText: '0 коммитов', differenceText: '0 коммитов' },
          { title: '501 — 1000 строк', valueText: '0 коммитов', differenceText: '0 коммитов' },
          { title: '101 — 500 строк', valueText: '0 коммитов', differenceText: '0 коммитов' },
          { title: '1 — 100 строк', valueText: '0 коммитов', differenceText: '0 коммитов' },
        ],
      },
    },
    {
      alias: 'activity',
      data: {
        title: 'Коммиты',
        subtitle: sprint.name,
        data: {
          mon: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          tue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          wed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          thu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          fri: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          sat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          sun: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      },
    },
  ]);
});
