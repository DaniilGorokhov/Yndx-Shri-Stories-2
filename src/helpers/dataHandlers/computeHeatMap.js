function computeHeatMap(activeCommits) {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

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

    const commitDate = new Date(commit.timestamp);
    const commitDay = commitDate.getDay();
    let commitHour = commitDate.getHours();

    // Round minutes for intermediate timestamps (from 0 to 22),
    // for example 0:35 will increase value of day[1], not day[0],
    // where day is array of 24 values for heatMap and index is hour
    const commitMinutes = commitDate.getMinutes();
    if (commitMinutes >= 30 && commitHour !== 23) {
      commitHour += 1;
    }

    const dayName = days[commitDay];
    heatMapData[dayName][commitHour] += 1;
  }

  return heatMapData;
}

module.exports = {
  computeHeatMap,
};
