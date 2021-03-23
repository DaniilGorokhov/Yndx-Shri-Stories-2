const { prepareData } = require('../index');
const { users } = require('../entityHandlers/userHandler');
const { likes } = require('../entityHandlers/commentHandler');
const { sprints, activeSprint } = require('../entityHandlers/sprintHandler');
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
  getHandledTestCommits,
} = require('../helpers/generators/handledEntities/getHandledTestCommits');

afterEach(() => {
  users.forEach((value, key) => {
    users.delete(key);
  });

  likes.forEach((value, key) => {
    likes.delete(key);
  });

  while (sprints.length) sprints.pop();
  delete activeSprint.data;

  while (commits.length) commits.pop();
  commitSummaries.forEach((value, key) => {
    commitSummaries.delete(key);
  });

  summaries.forEach((value, key) => {
    summaries.delete(key);
  });
});

describe('prepareData (entity handling) function tests', () => {
  test('throw error if entity type is invalid', () => {
    const obj = { type: 'Invalid' };

    expect(() => prepareData([obj], { sprintId: 1 })).toThrow('error: type of entity is invalid');
  });

  test('throw error if active sprint did not find', () => {
    expect(() => prepareData([], { sprintId: 1 })).toThrow('error: active sprint did not find');
  });

  describe('sprint entity handling', () => {
    test('save sprint when passed entity with type Sprint', () => {
      const sprint = getTestSprint();

      prepareData([sprint], { sprintId: 1 });

      expect(sprints).toHaveLength(1);
    });
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
      for (let userId = 1; userId < 200000; userId += 1) {
        const newUser = getTestUser({ userId });

        currentUser.friends.push(newUser);
        currentUser = newUser;
      }

      prepareData([user, sprint], { sprintId: 1 });

      expect(users.size).toBe(200000);
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
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
      const author = getTestUser();
      const commit = getTestCommit({ author });

      prepareData([commit, sprint], { sprintId: 1 });

      expect(users.size).toBe(1);
    });

    test('do not save commit.author as user if commit.author is user.id', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
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
      const user = getTestUser({ comments: true, commentsItems: [comment] });

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
      const summary = getTestSummary({ comments: true, commentsItems: comments });

      prepareData([summary, sprint], { sprintId: 1 });

      expect(likes.size).toBe(1);
      // 1 below is a user.id of author of comments
      expect(likes.get(1)).toHaveLength(3);
    });

    test('save likes from comment, that in issue, which passed as property of project entity', () => {
      const sprint = getTestSprint();
      const likesToTest = [1, 2, 3, 4, 5];
      const comment = getTestComment({ likesToTest });
      const issue = getTestIssue({ comments: [comment] });
      const project = getTestProject({ issues: [issue] });

      prepareData([project, sprint], { sprintId: 1 });

      expect(likes.size).toBe(1);
      expect(likes.get(1)).toHaveLength(1);
    });
  });

  describe('commit entity handling', () => {
    test('save commits if passed entities with type Commit', () => {
      const now = Date.now();
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit1 = getTestCommit({ commitId: '111-x', timestamp: now });

      const author = getTestUser();
      const commit2 = getTestCommit({ commitId: '211-x', author, timestamp: now });

      const commit3 = getTestCommit({ commitId: '311-x', author: 2, timestamp: now });

      prepareData([commit1, commit2, commit3, sprint], { sprintId: 1 });

      const expectedResult = getHandledTestCommits({
        commitIds: ['111-x', '211-x', '311-x'],
        authorIds: [1, 1, 2],
        timestamps: [now, now, now],
      });

      expect(commits).toHaveLength(3);
      expect(commits).toStrictEqual(expectedResult);
    });

    test('save commits if passed entity with type User with property commits', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const now = Date.now();
      const commitsToTest = [];
      for (let commitIx = 0; commitIx < 5; commitIx += 1) {
        commitsToTest.push(getTestCommit({
          commitId: `${commitIx}11-x`,
          author: 1,
          timestamp: now,
        }));
      }

      const user = getTestUser({ commits: true, commitsItems: commitsToTest });

      prepareData([user, sprint], { sprintId: 1 });

      expect(commits).toHaveLength(5);
      for (let commitIx = 0; commitIx < 5; commitIx += 1) {
        expect(commits[commitIx]).toStrictEqual({
          id: `${commitIx}11-x`,
          author: 1,
          timestamp: now,
        });
      }
    });

    test('save commits if passed entity with type Project with property commits', () => {
      const now = Date.now();
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
      const commitsToTest = [];
      for (let commitIx = 0; commitIx < 5; commitIx += 1) {
        commitsToTest.push(getTestCommit({
          commitId: `${commitIx}11-x`,
          timestamp: now,
        }));
      }
      const project = getTestProject({ commits: commitsToTest });
      const expectedCommits = getHandledTestCommits({
        commitIds: ['011-x', '111-x', '211-x', '311-x', '411-x'],
        authorIds: [1, 1, 1, 1, 1],
        timestamps: [now, now, now, now, now],
      });

      prepareData([project, sprint], { sprintId: 1 });

      expect(commits).toHaveLength(5);
      expect(commits).toStrictEqual(expectedCommits);
    });

    test('save commits of passed entity with type User '
      + 'with deep nesting other users with property commits', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const user = getTestUser({
        userId: 0,
      });
      let currentUser = user;
      for (let id = 0; id < 99999; id += 1) {
        const newUser = getTestUser({
          userId: 1 + id,
        });

        if ((1 + id) % 2 === 1) {
          newUser.commits = [
            getTestCommit({
              commitId: id,
            }),
          ];
        }

        currentUser.friends = [newUser];
        currentUser = newUser;
      }

      prepareData(
        [
          sprint,
          user,
        ],
        { sprintId: 1 },
      );

      expect(commits).toHaveLength(50000);
    });

    test('save commits if passed project with issue with comment '
      + 'with likes with user, who has friends with user with commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit();
      const user = getTestUser({
        userId: 0,
        commits: true,
        commitsItems: [commit],
      });
      const userWithFriend = getTestUser({
        userId: 1,
      });
      userWithFriend.friends = [user];
      const comment = getTestComment({
        likes: [userWithFriend],
      });
      const issue = getTestIssue({
        comments: [comment],
      });
      const project = getTestProject({
        issues: [issue],
      });

      prepareData(
        [
          project,
          sprint,
        ],
        { sprintId: 1 },
      );

      expect(commits).toHaveLength(1);
    });

    test('save commit if passed user with comment with likes with user, who has commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit();
      const user = getTestUser({
        userId: 1,
        commits: true,
        commitsItems: [commit],
      });
      const comment = getTestComment({
        likes: [user],
      });
      const userWithComment = getTestUser({
        userId: 1,
        comments: true,
        commentsItems: [comment],
      });

      prepareData(
        [
          sprint,
          userWithComment,
        ],
        { sprintId: 1 },
      );

      expect(commits).toHaveLength(1);
    });

    test('save commits if passed commit with author as '
      + 'user with comment with likes with user, who has commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        commitId: '011-x',
      });
      const user = getTestUser({
        userId: 1,
        commits: true,
        commitsItems: [commit],
      });
      const comment = getTestComment({
        likes: [user],
      });
      const userWithComment = getTestUser({
        userId: 1,
        comments: true,
        commentsItems: [comment],
      });
      const commitWithAuthor = getTestCommit({
        commitId: '111-x',
        author: userWithComment,
      });

      prepareData(
        [
          sprint,
          commitWithAuthor,
        ],
        { sprintId: 1 },
      );

      expect(commits).toHaveLength(2);
    });

    test('save commits if passed issue with resolvedBy as '
      + 'user with comment with likes with user, who has commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit();
      const user = getTestUser({
        userId: 1,
        commits: true,
        commitsItems: [commit],
      });
      const comment = getTestComment({
        likes: [user],
      });
      const userWithComment = getTestUser({
        userId: 1,
        comments: true,
        commentsItems: [comment],
      });
      const issue = getTestIssue({
        resolvedBy: true,
        resolvedByUser: userWithComment,
      });

      prepareData(
        [
          sprint,
          issue,
        ],
        { sprintId: 1 },
      );

      expect(commits).toHaveLength(1);
    });

    test('save commit if passed entity with type Project '
      + 'with deep nesting with property commits', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        commitId: '011-x',
        timestamp: 1000,
      });

      let currentProject = getTestProject({
        projectId: '011-x',
      });
      const projectsToTest = [currentProject];
      for (let projectIx = 0; projectIx < 100000; projectIx += 1) {
        const project = getTestProject({
          projectId: `${projectIx + 1}11-x`,
        });
        currentProject.dependencies = [project];
        currentProject = project;

        if (projectIx === 99999) {
          project.commits = [commit];
        }
      }

      prepareData([...projectsToTest, sprint], { sprintId: 1 });

      expect(commits).toHaveLength(1);
      expect(commits[0]).toStrictEqual({
        id: '011-x',
        author: 1,
        timestamp: 1000,
      });
    });
  });

  describe('summary entity handling', () => {
    test('save summary if passed entity with type Summary', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
      const summary = getTestSummary();

      prepareData([sprint, summary], { sprintId: 1 });

      expect(summaries.size).toBe(1);
      expect(summaries.get(summary.id)).toStrictEqual({
        id: summary.id,
        value: summary.added + summary.removed,
      });
    });

    test('save summary if passed entity with type Commit with properties summaries', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const summary = getTestSummary();
      const commit = getTestCommit({
        summaries: [summary],
      });

      prepareData([sprint, commit], { sprintId: 1 });

      expect(summaries.size).toBe(1);
      expect(summaries.get(summary.id)).toStrictEqual({
        id: summary.id,
        value: summary.added + summary.removed,
      });
    });

    test('wire summary.id and commit.id '
      + 'if passed entity with type Commit with properties summaries', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const summariesToTest = [];
      for (let summaryId = 0; summaryId < 5; summaryId += 1) {
        const summary = getTestSummary({
          summaryId,
        });

        summariesToTest.push(summary);
      }

      const commit = getTestCommit({
        summaries: summariesToTest,
      });

      prepareData([sprint, commit], { sprintId: 1 });

      expect(commitSummaries.get(commit.id)).toStrictEqual([0, 1, 2, 3, 4]);
    });
  });
});
