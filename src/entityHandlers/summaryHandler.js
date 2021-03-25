// Wire summaryId and summary entity.
const summaries = new Map();

function summaryHandler(summary) {
  const handledSummary = {
    id: summary.id,
    value: summary.added + summary.removed,
  };

  summaries.set(handledSummary.id, handledSummary);
}

module.exports = {
  summaries,
  summaryHandler,
};
