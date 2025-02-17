// Return data in required view for chart slide.
function chartPrepareData(sprintCommitsArray, userCommitsArray, { name }) {
  const values = [];

  for (let ix = 0; ix < sprintCommitsArray.length; ix += 1) {
    const currentItem = sprintCommitsArray[ix];
    const sprint = {
      title: currentItem.sprint.id.toString(),
      hint: currentItem.sprint.name,
      value: currentItem.commits.length,
    };

    if (currentItem.sprint.active) {
      sprint.active = true;
    }

    values.push(sprint);
  }

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
