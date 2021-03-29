const { prepareData } = require('../index');

const { getTestUser } = require('../helpers/generators/getTestUser');
const { getTestComment } = require('../helpers/generators/getTestComment');
const { getTestCommit } = require('../helpers/generators/getTestCommit');
const { getTestIssue } = require('../helpers/generators/getTestIssue');
const { getTestSummary } = require('../helpers/generators/getTestSummary');
const { getTestSprint } = require('../helpers/generators/getTestSprint');
const { getTestProject } = require('../helpers/generators/getTestProject');

describe('prepareData (entity handling) function tests', () => {
  test('throw error if entity type is invalid', () => {
    const obj = { type: 'Invalid' };

    expect(() => prepareData([obj], { sprintId: 1 })).toThrow('error: type of entity is invalid');
  });

  test('throw error if active sprint did not find', () => {
    expect(() => prepareData([], { sprintId: 1 })).toThrow('error: active sprint did not find');
  });

  test('return same result if function called a number of times', () => {
    const sprint = getTestSprint();

    const result1 = prepareData([sprint], { sprintId: 1 });
    const result2 = prepareData([sprint], { sprintId: 1 });

    expect(result1).toStrictEqual(result2);
  });

  describe('sprint entity handling', () => {
    test('save sprint when passed entity with type Sprint', () => {
      const sprint = getTestSprint();

      const slidesPreparedData = prepareData([sprint], { sprintId: 1 });

      expect(slidesPreparedData[2].data.values).toHaveLength(1);
    });

    test('save sprint only one time if passed sprints with same id (without rewriting)', () => {
      const sprint = getTestSprint({
        name: 'test sprint name1',
        startAt: 0,
        finishAt: 604799999,
      });
      const sprintAgain = getTestSprint({
        name: 'test sprint name2',
        startAt: 0,
        finishAt: 604799999,
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          sprintAgain,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values).toHaveLength(1);
      expect(slidesPreparedData[2].data.values[0].hint).toBe(sprint.name);
    });
  });

  describe('user entity handling', () => {
    test('save user when passed entity with type User', () => {
      const sprint = getTestSprint();
      const user = getTestUser();

      const slidesPreparedData = prepareData([user, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(1);
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

      const slidesPreparedData = prepareData([user, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(200000);
    });

    test('save user when passed entity with type Comment with property author', () => {
      const sprint = getTestSprint();
      const author = getTestUser();
      const comment = getTestComment({ author });

      const slidesPreparedData = prepareData([comment, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(1);
    });

    test('do not save comment.author as user if comment.author is user.id', () => {
      const sprint = getTestSprint();
      const comment = getTestComment();

      const slidesPreparedData = prepareData([comment, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(0);
    });

    test('save users from comment.likes', () => {
      const sprint = getTestSprint();

      const likesForComment = [];
      for (let userId = 2; userId < 5; userId += 1) {
        likesForComment.push(getTestUser({ userId }));
      }

      const comment = getTestComment({ likes: likesForComment });

      const slidesPreparedData = prepareData([comment, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(3);
    });

    test('do not save user from comment.likes if it is user.id', () => {
      const sprint = getTestSprint();
      const comment = getTestComment({
        likes: [2, 3, 4],
      });

      const slidesPreparedData = prepareData([comment, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(0);
    });

    test('save commit.author as user if it is user entity', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
      const author = getTestUser();
      const commit = getTestCommit({ author });

      const slidesPreparedData = prepareData([commit, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(1);
    });

    test('do not save commit.author as user if commit.author is user.id', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
      const commit = getTestCommit();

      const slidesPreparedData = prepareData([commit, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(0);
    });

    test('do not save user if issue has not resolvedBy property', () => {
      const sprint = getTestSprint();
      const issue = getTestIssue();

      const slidesPreparedData = prepareData([issue, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(0);
    });

    test('save issue.resolvedBy as user if resolvedByUser is user entity', () => {
      const sprint = getTestSprint();
      const user = getTestUser();
      const issue = getTestIssue({
        resolvedBy: true,
        resolvedByUser: user,
      });

      const slidesPreparedData = prepareData([issue, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(1);
    });

    test('ignore issue.resolvedBy if issue.resolvedBy is user.id', () => {
      const sprint = getTestSprint();
      const issue = getTestIssue({
        resolvedBy: true,
      });

      const slidesPreparedData = prepareData([issue, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(0);
    });

    test('save users if passed commit with author as '
      + 'user with comment with likes with another user', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const user = getTestUser({
        userId: 0,
        commits: true,
        commitsItems: [],
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

      const slidesPreparedData = prepareData(
        [
          sprint,
          commitWithAuthor,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[1].data.users).toHaveLength(2);
    });

    test('save users if passed issue with resolvedBy as '
      + 'user with comment with likes with another user', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const user = getTestUser({
        userId: 0,
        commits: true,
        commitsItems: [],
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

      const slidesPreparedData = prepareData(
        [
          sprint,
          issue,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[1].data.users).toHaveLength(2);
    });

    test('save user only one time if passed users with same id (without rewriting)', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const user = getTestUser({
        userId: 1,
        name: 'Oleg',
      });
      const userAgain = getTestUser({
        userId: 1,
        name: 'Kirill',
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          user,
          userAgain,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[1].data.users).toHaveLength(1);
      expect(slidesPreparedData[1].data.users[0].name).toBe(user.name);
    });
  });

  describe('comment entity handling', () => {
    test('save likes if passed entity with type Comment', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
      const comment = getTestComment({ likes: [2, 3, 4], createdAt: 1000 });
      const author = getTestUser();

      const slidesPreparedData = prepareData([comment, author, sprint], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(3);
      expect(slidesPreparedData[1].data.users[0].id).toBe(author.id);
    });

    test('save likes if passed entity with type User with non-empty property comments', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 60479999,
      });
      const comment = getTestComment({ likes: [2], createdAt: 1000 });
      const user = getTestUser({ comments: true, commentsItems: [comment] });

      const slidesPreparedData = prepareData([user, sprint], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(1);
      expect(slidesPreparedData[1].data.users[0].id).toBe(user.id);
    });

    test('do not save likes if passed entity with type User without property comments', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 60479999,
      });
      const user = getTestUser();

      const slidesPreparedData = prepareData([user, sprint], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(0);
    });

    test('save likes if passed entity with type Issue with non-empty property comments', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 60479999,
      });
      const comments = [];
      for (let commentId = 1; commentId < 4; commentId += 1) {
        comments.push(getTestComment({
          commentId: `${commentId}11-x`,
          createdAt: 1000,
          likes: [1],
        }));
      }
      const issue = getTestIssue({ comments });
      const user = getTestUser();

      const slidesPreparedData = prepareData([user, issue, sprint], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(3);
    });

    test('save likes if passed entity with type Summary with comments', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 60479999,
      });
      const comments = [];
      for (let commentId = 1; commentId < 4; commentId += 1) {
        comments.push(getTestComment({
          commentId: `${commentId}11-x`,
          createdAt: 1000,
          likes: [1],
        }));
      }
      const summary = getTestSummary({ comments: true, commentsItems: comments });
      const user = getTestUser();

      const slidesPreparedData = prepareData([summary, user, sprint], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(3);
    });

    test('save likes from comment, that in issue, which passed as property of project entity', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 60479999,
      });
      const likesToTest = [1, 2, 3, 4, 5];
      const comment = getTestComment({ createdAt: 1000, likes: likesToTest });
      const issue = getTestIssue({ comments: [comment] });
      const project = getTestProject({ issues: [issue] });
      const user = getTestUser();

      const slidesPreparedData = prepareData([user, project, sprint], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(5);
    });

    test('save likes from comment, that is contained in user.comments, '
      + 'when user is deep in friends property of others users', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 60479999,
      });

      const comment = getTestComment({
        author: 199999,
        likes: [0, 1, 2, 3],
        createdAt: 1000,
      });

      const user = getTestUser({ userId: 0 });
      let currentUser = user;
      for (let userId = 1; userId < 200000; userId += 1) {
        const newUser = getTestUser({ userId });

        currentUser.friends.push(newUser);
        currentUser = newUser;

        if (userId === 199999) {
          currentUser.comments = [comment];
        }
      }

      const slidesPreparedData = prepareData([user, sprint], { sprintId: 1 });

      expect(slidesPreparedData[1].data.users).toHaveLength(200000);
      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(4);
    });

    test('save likes only one time if passed comments with same id, '
      + 'but with different likes (without rewriting)', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const comment = getTestComment({
        commentId: '011-x',
        likes: [1, 2, 3],
        createdAt: 1000,
      });
      const commentAgain = getTestComment({
        commentId: '011-x',
        likes: [1, 2],
        createdAt: 1000,
      });

      const user = getTestUser();

      const slidesPreparedData = prepareData(
        [
          sprint,
          comment,
          commentAgain,
          user,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[1].data.users).toHaveLength(1);
      expect(parseInt(slidesPreparedData[1].data.users[0].valueText, 10)).toBe(3);
    });
  });

  describe('commit entity handling', () => {
    test('save commits if passed entities with type Commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit1 = getTestCommit({ commitId: '111-x', timestamp: 1000 });

      const author = getTestUser();
      const commit2 = getTestCommit({ commitId: '211-x', author, timestamp: 1000 });

      const commit3 = getTestCommit({ commitId: '311-x', author: 2, timestamp: 1000 });

      const slidesPreparedData = prepareData([
        commit1,
        commit2,
        commit3,
        sprint,
      ], { sprintId: 1 });

      expect(slidesPreparedData[2].data.values[0].value).toBe(3);
    });

    test('save commits if passed entity with type User with property commits', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commitsToTest = [];
      for (let commitIx = 0; commitIx < 5; commitIx += 1) {
        commitsToTest.push(getTestCommit({
          commitId: `${commitIx}11-x`,
          author: 1,
          timestamp: 1000,
        }));
      }

      const user = getTestUser({ commits: true, commitsItems: commitsToTest });

      const slidesPreparedData = prepareData([user, sprint], { sprintId: 1 });

      expect(slidesPreparedData[2].data.values[0].value).toBe(5);
    });

    test('save commits if passed entity with type Project with property commits', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });
      const commitsToTest = [];
      for (let commitIx = 0; commitIx < 5; commitIx += 1) {
        commitsToTest.push(getTestCommit({
          commitId: `${commitIx}11-x`,
          timestamp: 1000,
        }));
      }
      const project = getTestProject({ commits: commitsToTest });

      const slidesPreparedData = prepareData([project, sprint], { sprintId: 1 });

      expect(slidesPreparedData[2].data.values[0].value).toBe(5);
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
              timestamp: 1000,
            }),
          ];
        }

        currentUser.friends = [newUser];
        currentUser = newUser;
      }

      const slidesPreparedData = prepareData(
        [
          sprint,
          user,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values[0].value).toBe(50000);
    });

    test('save commits if passed project with issue with comment '
      + 'with likes with user, who has friends with user with commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        timestamp: 1000,
      });
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

      const slidesPreparedData = prepareData(
        [
          project,
          sprint,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values[0].value).toBe(1);
    });

    test('save commit if passed user with comment with likes with user, who has commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        timestamp: 1000,
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
        userId: 2,
        comments: true,
        commentsItems: [comment],
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          userWithComment,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values[0].value).toBe(1);
    });

    test('save commits if passed commit with author as '
      + 'user with comment with likes with user, who has commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        commitId: '011-x',
        timestamp: 1000,
      });
      const user = getTestUser({
        userId: 0,
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
        timestamp: 1000,
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          commitWithAuthor,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values[0].value).toBe(2);
    });

    test('save commits if passed issue with resolvedBy as '
      + 'user with comment with likes with user, who has commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        timestamp: 1000,
      });
      const user = getTestUser({
        userId: 0,
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

      const slidesPreparedData = prepareData(
        [
          sprint,
          issue,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values[0].value).toBe(1);
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

      const slidesPreparedData = prepareData([...projectsToTest, sprint], { sprintId: 1 });

      expect(slidesPreparedData[2].data.values[0].value).toBe(1);
    });

    test('save commit only one time if passed commits with same id (without rewrite)', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        commitId: '011-x',
        author: 1,
        timestamp: 1000,
      });
      const commitAgain = getTestCommit({
        commitId: '011-x',
        author: 2,
        timestamp: 704799999,
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          commit,
          commitAgain,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values[0].value).toBe(1);
    });
  });

  describe('summary entity handling', () => {
    test('save summary if passed entity with type Summary', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit = getTestCommit({
        summaries: [1],
        timestamp: 1000,
      });

      const summary = getTestSummary();

      const slidesPreparedData = prepareData([commit, sprint, summary], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[3].data.totalText, 10)).toBe(1);
    });

    test('save summary if passed entity with type Commit with properties summaries', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const summary = getTestSummary();

      const commit = getTestCommit({
        summaries: [summary],
        timestamp: 1000,
      });

      const slidesPreparedData = prepareData([sprint, commit], { sprintId: 1 });

      expect(parseInt(slidesPreparedData[3].data.totalText, 10)).toBe(1);
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
          added: 21,
          removed: 0,
        });

        summariesToTest.push(summary);
      }

      const commit = getTestCommit({
        summaries: summariesToTest,
        timestamp: 1000,
      });

      const slidesPreparedData = prepareData([sprint, commit], { sprintId: 1 });
      const receivedDiagramMidValue = parseInt(
        slidesPreparedData[3].data.categories[2].valueText,
        10,
      );

      expect(receivedDiagramMidValue).toBe(1);
    });

    test('filter summaries in commit.summaries - save only unique summary.id\'s', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const summary1 = getTestSummary({
        summaryId: 1,
        added: 21,
        removed: 0,
      });
      const summary2 = getTestSummary({
        summaryId: 2,
        added: 21,
        removed: 0,
      });

      const commit = getTestCommit({
        summaries: [
          2,
          summary1,
          summary2,
          1,
          2,
        ],
        timestamp: 1000,
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          commit,
        ],
        { sprintId: 1 },
      );
      const receivedDiagramMinValue = parseInt(
        slidesPreparedData[3].data.categories[3].valueText,
        10,
      );

      expect(receivedDiagramMinValue).toBe(1);
    });

    test('do not save summary, if it is passed unrelated to commit', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const summary = getTestSummary({
        added: 50,
        removed: 25,
      });
      const commit = getTestCommit({
        timestamp: 1000,
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          summary,
          commit,
        ],
        { sprintId: 1 },
      );
      const receivedDiagramMinValue = parseInt(
        slidesPreparedData[3].data.categories[3].valueText,
        10,
      );

      expect(receivedDiagramMinValue).toBe(0);
    });

    test('save summary only one time if passed summaries with same id (without rewrite)', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const summary = getTestSummary({
        summaryId: 1,
        added: 1000,
        removed: 500,
      });
      const summaryAgain = getTestSummary({
        summaryId: 1,
        added: 200,
        removed: 500,
      });

      const commit = getTestCommit({
        summaries: [summary, summaryAgain],
        timestamp: 1000,
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          commit,
        ],
        { sprintId: 1 },
      );

      expect(parseInt(slidesPreparedData[3].data.categories[0].valueText, 10)).toBe(1);
    });
  });

  describe('project entity handling', () => {
    test('handle project only one time if passed projects with same id', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const commit1 = getTestCommit({
        commitId: 1,
        timestamp: 1000,
      });
      const commit2 = getTestCommit({
        commitId: 2,
        timestamp: 1000,
      });

      const project = getTestProject({
        projectId: '011-x',
        commits: [commit1],
      });
      const projectAgain = getTestProject({
        projectId: '011-x',
        commits: [commit2],
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          project,
          projectAgain,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[2].data.values[0].value).toBe(1);
    });
  });

  describe('issue entity handling', () => {
    test('handle issue only one time if passed issues with same id', () => {
      const sprint = getTestSprint({
        startAt: 0,
        finishAt: 604799999,
      });

      const user1 = getTestUser({
        userId: 1,
      });
      const user2 = getTestUser({
        userId: 2,
      });

      const issue = getTestIssue({
        issueId: '34abc',
        resolvedBy: true,
        resolvedByUser: user1,
      });
      const issueAgain = getTestIssue({
        issueId: '34abc',
        resolvedBy: true,
        resolvedByUser: user2,
      });

      const slidesPreparedData = prepareData(
        [
          sprint,
          issue,
          issueAgain,
        ],
        { sprintId: 1 },
      );

      expect(slidesPreparedData[1].data.users).toHaveLength(1);
    });
  });
});
