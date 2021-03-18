const commits = [];
const handledCommitsId = new Set();

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

  if (!handledCommitsId.has(commit.id)) {
    handledCommitsId.add(commit.id);

    commits.push(handledCommit);
  }
}

module.exports = {
  commits,
  handledCommitsId,
  commitHandler,
};
