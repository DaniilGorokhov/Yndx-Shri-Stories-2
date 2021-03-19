function computeHeatMap(activeCommits, { startAt, finishAt }) {
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const sprintTime = finishAt - startAt;
  const dayTime = sprintTime / 7;
  const hourTime = dayTime / 24;

  const heatMapData = {};
  for (let dayIx = 0; dayIx < days.length; dayIx += 1) {
    const values = [];
    for (let hourIx = 0; hourIx < 24; hourIx += 1) {
      values.push(0);
    }

    heatMapData[days[dayIx]] = values;
  }

  for (let commitIx = 0; commitIx < activeCommits.length; commitIx += 1) {
    const commit = activeCommits[commitIx];

    const commitDate = (commit.timestamp - startAt);
    const commitDay = Math.floor(commitDate / dayTime) % 7;
    const commitHour = Math.floor(commitDate / hourTime) % 24;

    const dayName = days[commitDay];
    heatMapData[dayName][commitHour] += 1;
  }

  return heatMapData;
}

module.exports = {
  computeHeatMap,
};
