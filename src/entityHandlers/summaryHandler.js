// Wire summaryId and summary entity -> Map<summary.id, summary>.
const summaries = new Map();

function summaryHandler(summary) {
  const handledSummary = {
    id: summary.id,
    value: Math.abs(summary.added) + Math.abs(summary.removed),
  };

  summaries.set(handledSummary.id, handledSummary);
}

module.exports = {
  summaries,
  summaryHandler,
};
