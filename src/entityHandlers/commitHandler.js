const { userHandler } = require('./userHandler');

function commitHandler(commit) {
  if (typeof commit.author === 'object') {
    userHandler(commit.author);
  }
}

module.exports = {
  commitHandler,
};
