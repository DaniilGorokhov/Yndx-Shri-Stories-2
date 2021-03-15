const commits = new Map();

function commitHandler(commit) {
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

  if (commits.has(authorId)) {
    const currentAuthorCommits = commits.get(authorId);
    currentAuthorCommits.push(handledCommit);
  } else {
    commits.set(authorId, [handledCommit]);
  }
}

module.exports = {
  commits,
  commitHandler,
};
