const { getTestProject } = require('../getTestProject');
const { getTestIssue } = require('../getTestIssue');
const { getTestCommit } = require('../getTestCommit');

describe('getTestProject function tests', () => {
  test('return project object', () => {
    const project = getTestProject();

    expect(project).toStrictEqual({
      id: '11112222-3333-4444-5555-666677778888',
      type: 'Project',
      name: 'test project name',
      dependencies: [],
      issues: [],
      commits: [],
    });
  });

  test('return new object each call', () => {
    const project = getTestProject();
    const projectAgain = getTestProject();
    project.name = 'test project name2';

    expect(project.name).not.toBe(projectAgain.name);
  });

  test('return project with dependencies when passed dependenciesConfig', () => {
    const project = getTestProject({
      dependenciesConfig: [
        { projectId: '111-x' },
        {
          projectId: '211-x',
          dependenciesConfig: [
            { projectId: '311-x' },
          ],
        },
      ],
    });

    expect(project.dependencies[0].id).toBe('111-x');
    expect(project.dependencies[1].id).toBe('211-x');
    expect(project.dependencies[1].dependencies[0].id).toBe('311-x');
  });

  test('return project with passed issues', () => {
    const issues = [];
    for (let issueIx = 0; issueIx < 5; issueIx += 1) {
      issues.push(getTestIssue({
        issueId: `${issueIx}11-x`,
      }));
    }

    const project = getTestProject({ issues });

    expect(project.issues).toStrictEqual(issues);
  });

  test('return project with passed commits', () => {
    const commits = [];
    for (let commitIx = 0; commitIx < 5; commitIx += 1) {
      commits.push(getTestCommit({
        commitId: `${commitIx}11-x`,
      }));
    }

    const project = getTestProject({ commits });

    expect(project.commits).toStrictEqual(commits);
  });
});
