const { sortByProperty } = require('../helpers/dataHandlers/sortByProperty');

// this function prepare data for chart slide
function chartPrepareData(sprintCommitsArray, userCommitsArray, { name }) {
  const values = [];

  for (let sprintIx = 0; sprintIx < sprintCommitsArray.length; sprintIx += 1) {
    const sprint = {
      title: sprintCommitsArray[sprintIx].id.toString(),
      hint: sprintCommitsArray[sprintIx].name,
      value: sprintCommitsArray[sprintIx].commits.length,
    };

    if (sprintCommitsArray[sprintIx].active) {
      sprint.active = true;
    }

    values.push(sprint);
  }

  sortByProperty({
    array: values,
    propertyForSort: 'title',
  });

  const chartPreparedData = {
    alias: 'chart',
    data: {
      title: 'Коммиты',
      subtitle: name,
      values,
      users: userCommitsArray,
    },
  };

  return chartPreparedData;
}

module.exports = {
  chartPrepareData,
};
