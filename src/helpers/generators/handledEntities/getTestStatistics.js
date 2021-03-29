// This function generates statistics item.
// This logic is taken out, since in future statistics item may extend.
function getTestStatistics({
  min = 0,
  mid = 0,
  max = 0,
  extra = 0,
} = {}) {
  const statisticsItem = {
    min,
    mid,
    max,
    extra,
  };

  return statisticsItem;
}

module.exports = {
  getTestStatistics,
};
