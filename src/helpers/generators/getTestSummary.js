function getTestSummary({
  summaryId = 1,
  path = `./testpath${summaryId}.js`,
  added = 100,
  removed = 50,
  comments = false,
  commentItems = [],
} = {}) {
  const summary = {
    id: summaryId,
    type: 'Summary',
    path,
    added,
    removed,
  };

  if (comments) {
    summary.comments = commentItems;
  }

  return summary;
}

module.exports = {
  getTestSummary,
};
