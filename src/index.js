const { userHandler } = require('./entityHandlers/userHandler');
const { commentHandler } = require('./entityHandlers/commentHandler');
const { commitHandler } = require('./entityHandlers/commitHandler');
const { issueHandler } = require('./entityHandlers/issueHandler');

function prepareData(entities, { sprintId }) {
  for (let entityIx = 0; entityIx < entities.length; entityIx += 1) {
    switch (entities[entityIx].type) {
      case 'User':
        userHandler(entities[entityIx], sprintId);
        break;
      case 'Comment':
        commentHandler(entities[entityIx], sprintId);
        break;
      case 'Commit':
        commitHandler(entities[entityIx], sprintId);
        break;
      case 'Issue':
        issueHandler(entities[entityIx], sprintId);
        break;
      default:
        throw new Error('error: type of entity is invalid');
    }
  }
  // TODO sprintId for all handlers and handling sprintId if needed
}

module.exports = {
  prepareData,
};
