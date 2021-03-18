// Wire summaryId and summary entity.
const summaries = new Map();
// For wiring commitId and summaryIds.
// PS wiring process perform out of this function, here we only initialize storage
const commitSummaries = new Map();

function summaryHandler(summary) {
  const handledSummary = {
    id: summary.id,
    value: summary.added + summary.removed,
  };

  if (!summaries.has(handledSummary.id)) {
    summaries.set(handledSummary.id, handledSummary);
  }
}

module.exports = {
  summaries,
  commitSummaries,
  summaryHandler,
};
