const { prepareData } = require('../index');
const { users } = require('../entityHandlers/userHandler');
const { likes } = require('../entityHandlers/commentHandler');
const { sprints } = require('../entityHandlers/sprintHandler');

const { getTestUser } = require('../helpers/generators/getTestUser');
const { getTestComment } = require('../helpers/generators/getTestComment');
const { getTestCommit } = require('../helpers/generators/getTestCommit');
const { getTestIssue } = require('../helpers/generators/getTestIssue');
const { getTestSummary } = require('../helpers/generators/getTestSummary');
const { getTestSprint } = require('../helpers/generators/getTestSprint');

const {
  getHandledTestUserLikes,
} = require('../helpers/generators/handledEntities/getHandledTestUserLikes');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });

  likes.forEach((value, key) => {
    likes.delete(key);
  });

  sprints.forEach((value, key) => {
    sprints.delete(key);
  });
});

describe('prepareData function tests', () => {
  test('throw error if entity type is invalid', () => {
    const obj = { type: 'Invalid' };

    expect(() => prepareData([obj], { sprintId: 1 })).toThrow('error: type of entity is invalid');
  });

  test('throw error if active sprint did not find', () => {
    expect(() => prepareData([], { sprintId: 1 })).toThrow('error: active sprint did not find');
  });

  describe('user entity handling', () => {
    test('save user when passed entity with type User', () => {
      const sprint = getTestSprint();
      const user = getTestUser();

      prepareData([user, sprint], { sprintId: 1 });
      expect(users.size).toBe(1);
    });

    test('save users when they deep nested by property friends', () => {
      const sprint = getTestSprint();
      const user = getTestUser({ userId: 0 });
      let currentUser = user;
      for (let userId = 1; userId < 1000; userId += 1) {
        const newUser = getTestUser({ userId });

        currentUser.friends.push(newUser);
        currentUser = newUser;
      }

      prepareData([user, sprint], { sprintId: 1 });
      expect(users.size).toBe(1000);
    });

    test('save user when passed entity with type Comment with property author', () => {
      const sprint = getTestSprint();
      const author = getTestUser();
      const comment = getTestComment({ author });

      prepareData([comment, sprint], { sprintId: 1 });
      expect(users.size).toBe(1);
    });

    test('do not save comment.author as user if comment.author is user.id', () => {
      const sprint = getTestSprint();
      const comment = getTestComment();

      prepareData([comment, sprint], { sprintId: 1 });
      expect(users.size).toBe(0);
    });

    test('save users from comment.likes', () => {
      const sprint = getTestSprint();

      const likesForComment = [];
      for (let userId = 2; userId < 5; userId += 1) {
        likesForComment.push(getTestUser({ userId }));
      }

      const comment = getTestComment({ likes: likesForComment });

      prepareData([comment, sprint], { sprintId: 1 });
      expect(users.size).toBe(3);
    });

    test('do not save user from comment.likes if it is user.id', () => {
      const sprint = getTestSprint();
      const comment = getTestComment({
        likes: [2, 3, 4],
      });

      prepareData([comment, sprint], { sprintId: 1 });
      expect(users.size).toBe(0);
    });

    test('save commit.author as user', () => {
      const sprint = getTestSprint();
      const author = getTestUser();
      const commit = getTestCommit({ author });

      prepareData([commit, sprint], { sprintId: 1 });
      expect(users.size).toBe(1);
    });

    test('do not save commit.author as user if commit.author is user.id', () => {
      const sprint = getTestSprint();
      const commit = getTestCommit();

      prepareData([commit, sprint], { sprintId: 1 });
      expect(users.size).toBe(0);
    });

    test('do not save user if issue has not resolvedBy property', () => {
      const sprint = getTestSprint();
      const issue = getTestIssue();

      prepareData([issue, sprint], { sprintId: 1 });
      expect(users.size).toBe(0);
    });

    test('save issue.resolvedBy as user if resolvedByUser is user entity', () => {
      const sprint = getTestSprint();
      const user = getTestUser();
      const issue = getTestIssue({
        resolvedBy: true,
        resolvedByUser: user,
      });

      prepareData([issue, sprint], { sprintId: 1 });
      expect(users.size).toBe(1);
    });

    test('ignore issue.resolvedBy if issue.resolvedBy is user.id', () => {
      const sprint = getTestSprint();
      const issue = getTestIssue({
        resolvedBy: true,
      });

      prepareData([issue, sprint], { sprintId: 1 });
      expect(users.size).toBe(0);
    });

    test('save user when passed entity with type Issue with property resolvedBy', () => {
      const sprint = getTestSprint();
      const user = getTestUser();
      const issue = getTestIssue({
        resolvedBy: true,
        resolvedByUser: user,
      });

      prepareData([issue, sprint], { sprintId: 1 });
      expect(users.size).toBe(1);
    });
  });

  describe('comment entity handling', () => {
    test('save likes if passed entity with type Comment', () => {
      const sprint = getTestSprint();
      const comment = getTestComment({ likes: [2, 3, 4] });

      prepareData([comment, sprint], { sprintId: 1 });
      expect(likes.size).toBe(1);
      expect(likes.get(comment.author)).toHaveLength(1);
      expect(likes.get(comment.author)[0].quantity).toBe(3);
    });

    test('save likes if passed entity with type User with non-empty property comments', () => {
      const sprint = getTestSprint();
      const comment = getTestComment({ likes: [2] });
      const user = getTestUser({ comments: true, commentItems: [comment] });

      prepareData([user, sprint], { sprintId: 1 });
      expect(likes.size).toBe(1);
      expect(likes.get(user.id)).toHaveLength(1);
      expect(likes.get(user.id)[0].quantity).toBe(1);
    });

    test('do not save likes if passed entity with type User without property comments', () => {
      const sprint = getTestSprint();
      const user = getTestUser();

      prepareData([user, sprint], { sprintId: 1 });
      expect(likes.size).toBe(0);
    });

    test('save likes if passed entity with type Issue with non-empty property comments', () => {
      const sprint = getTestSprint();
      const comments = [];
      for (let commentId = 1; commentId < 4; commentId += 1) {
        comments.push(getTestComment({ commentId: `${commentId}1112222-3333-4444-5555-666677778888` }));
      }
      const issue = getTestIssue({ comments });

      prepareData([issue, sprint], { sprintId: 1 });
      expect(likes.size).toBe(1);
      // 1 below is a user.id of author of comments
      expect(likes.get(1)).toHaveLength(3);
    });

    test('save likes if passed entity with type Summary', () => {
      const sprint = getTestSprint();
      const comments = [];
      for (let commentId = 1; commentId < 4; commentId += 1) {
        comments.push(getTestComment({ commentId: `${commentId}1112222-3333-4444-5555-666677778888` }));
      }
      const summary = getTestSummary({ comments: true, commentItems: comments });

      prepareData([summary, sprint], { sprintId: 1 });
      expect(likes.size).toBe(1);
      // 1 below is a user.id of author of comments
      expect(likes.get(1)).toHaveLength(3);
    });
  });

  describe('result of function tests', () => {
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
            commentItems: comments.slice(10, 15),
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

      const summaries = [];
      for (let summaryId = 0; summaryId <= 5; summaryId += 1) {
        let summary;
        if (summaryId === 2) {
          summary = getTestSummary({
            summaryId,
            comments: true,
            commentItems: [...comments.slice(18, 20), '111-x'],
          });
        } else {
          summary = getTestSummary({ summaryId });
        }

        summaries.push(summary);
      }

      const issues = [];
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

        issues.push(issue);
      }

      const commits = [];
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

        commits.push(commit);
      }

      const entities = [
        ...sprintsToTest,
        ...comments.slice(0, 10),
        ...comments.slice(17, 19),
        ...usersToTest,
        ...summaries,
        ...issues,
        ...commits,
      ];
      const slidesPreparedData = prepareData(
        entities,
        { sprintId: 1 },
      );

      const expectedUsers = getHandledTestUserLikes({
        // when values are equal, user will be 'greater' if person has appeared earlier
        userIds: [8, 6, 7, 0, 1, 2, 3, 4, 5, 9, 10, 11, 18, 19, 20, 12, 13, 14, 15, 16, 17],
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
          '0 голосов',
        ],
      });
      expect(slidesPreparedData).toStrictEqual([{
        alias: 'vote',
        data: {
          title: 'Самый 🔎 внимательный разработчик',
          subtitle: 'test sprint name1',
          emoji: '🔎',
          users: expectedUsers,
        },
      }]);
    });
  });
});
