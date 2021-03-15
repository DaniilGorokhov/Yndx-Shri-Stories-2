function getTestProject({
  projectId = '11112222-3333-4444-5555-666677778888',
  name = 'test project name',
  dependenciesConfig = [],
  issues = [],
  commits = [],
} = {}) {
  const dependencies = [];
  for (let dependencyIx = 0; dependencyIx < dependenciesConfig.length; dependencyIx += 1) {
    dependencies.push(
      getTestProject(dependenciesConfig[dependencyIx]),
    );
  }

  const project = {
    id: projectId,
    type: 'Project',
    name,
    dependencies,
    issues,
    commits,
  };

  return project;
}

module.exports = {
  getTestProject,
};
