// This function generates summary entity with passed property values.
function getTestSummary({
  summaryId = 1,
  path = `./testpath${summaryId}.js`,
  added = 100,
  removed = 50,
  comments = false,
  commentsItems = [],
} = {}) {
  const summary = {
    id: summaryId,
    type: 'Summary',
    path,
    added,
    removed,
  };

  if (comments) {
    summary.comments = commentsItems;
  }

  return summary;
}

module.exports = {
  getTestSummary,
};
