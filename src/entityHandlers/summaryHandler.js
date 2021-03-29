function summaryHandler(summary, summariesStorage) {
  const handledSummary = {
    id: summary.id,
    value: Math.abs(summary.added) + Math.abs(summary.removed),
  };

  summariesStorage.set(handledSummary.id, handledSummary);
}

module.exports = {
  summaryHandler,
};
