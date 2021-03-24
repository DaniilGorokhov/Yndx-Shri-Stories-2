// this function compute statistics data for sprints.
// return array of statistics items - one by sprint.
function computeStatistics({
  // sprint here - array of its commits.
  sprints,
  commitSummaries,
  summaries,
}) {
  const statisticsItem = {
    min: 0,
    mid: 0,
    max: 0,
    extra: 0,
  };

  const statistics = [];

  for (let sprintIx = 0; sprintIx < sprints.length; sprintIx += 1) {
    const currentStatisticsItem = { ...statisticsItem };
    const currentSprint = sprints[sprintIx];

    for (let commitIx = 0; commitIx < currentSprint.length; commitIx += 1) {
      const currentCommit = currentSprint[commitIx];
      const currentSummaries = commitSummaries.get(currentCommit.id);

      let commitAmount = 0;

      if (currentSummaries) {
        for (let summaryIx = 0; summaryIx < currentSummaries.length; summaryIx += 1) {
          const summary = summaries.get(currentSummaries[summaryIx]);

          commitAmount += summary.value;
        }
      }

      if (commitAmount >= 1001) {
        currentStatisticsItem.extra += 1;
      } else if (commitAmount >= 501) {
        currentStatisticsItem.max += 1;
      } else if (commitAmount >= 101) {
        currentStatisticsItem.mid += 1;
      } else {
        currentStatisticsItem.min += 1;
      }
    }

    statistics.push(currentStatisticsItem);
  }

  return statistics;
}

module.exports = {
  computeStatistics,
};
