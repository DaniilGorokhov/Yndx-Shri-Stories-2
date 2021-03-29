// This function save commit with required properties and wire commit with summaries.
function commitHandler(commit, commitsStorage, commitSummariesStorage) {
  let authorId;
  if (typeof commit.author === 'object') {
    authorId = commit.author.id;
  } else {
    authorId = commit.author;
  }

  const handledCommit = {
    id: commit.id,
    author: authorId,
    timestamp: commit.timestamp,
  };

  commitsStorage.push(handledCommit);

  const currentCommitSummaries = [];
  const handledSummariesIds = new Set();
  for (let summaryIx = 0; summaryIx < commit.summaries.length; summaryIx += 1) {
    let newSummaryId;
    if (typeof commit.summaries[summaryIx] === 'object') {
      newSummaryId = commit.summaries[summaryIx].id;
    } else {
      newSummaryId = commit.summaries[summaryIx];
    }

    if (!handledSummariesIds.has(newSummaryId)) {
      currentCommitSummaries.push(newSummaryId);

      handledSummariesIds.add(newSummaryId);
    }
  }

  commitSummariesStorage.set(commit.id, currentCommitSummaries);
}

module.exports = {
  commitHandler,
};
