const { users, userHandler } = require('./entityHandlers/userHandler');
const { likes, commentHandler } = require('./entityHandlers/commentHandler');
const { sprints, sprintHandler } = require('./entityHandlers/sprintHandler');
// const { commitHandler } = require('./entityHandlers/commitHandler');

const { votePrepareData } = require('./slidesPrepareData/votePrepareData');

const { userLikes } = require('./helpers/dataHandlers/userLikes');
const { sortUserLikesArray } = require('./helpers/dataHandlers/sortUserLikesArray');

function prepareData(entities, { sprintId }) {
  for (let entityIx = 0; entityIx < entities.length; entityIx += 1) {
    const entity = entities[entityIx];

    // currentEntities - linked list
    let currentEntities = { data: entity, next: null };
    let tail = currentEntities;

    while (currentEntities !== null) {
      const currentEntity = currentEntities.data;

      switch (currentEntity.type) {
        case 'User':
          userHandler(currentEntity);

          if (currentEntity.comments) {
            for (let commentIx = 0; commentIx < currentEntity.comments.length; commentIx += 1) {
              if (typeof currentEntity.comments[commentIx] === 'object') {
                const newEntity = { data: currentEntity.comments[commentIx], next: null };
                tail.next = newEntity;
                tail = newEntity;
              }
            }
          }
          // TODO handling optional properties commits

          break;
        case 'Comment':
          if (typeof currentEntity.author === 'object') {
            userHandler(currentEntity.author);
          }

          for (let likeIx = 0; likeIx < currentEntity.likes.length; likeIx += 1) {
            if (typeof currentEntity.likes[likeIx] === 'object') {
              const newEntity = { data: currentEntity.likes[likeIx], next: null };
              tail.next = newEntity;
              tail = newEntity;
            }
          }

          commentHandler(currentEntity);

          break;
        case 'Commit':
          if (typeof currentEntity.author === 'object') {
            userHandler(currentEntity.author);
          }

          // commitHandler(currentEntity);

          break;
        case 'Issue':
          if (currentEntity.resolvedBy && typeof currentEntity.resolvedBy === 'object') {
            userHandler(currentEntity.resolvedBy);
          }

          for (let commentIx = 0; commentIx < currentEntity.comments.length; commentIx += 1) {
            if (typeof currentEntity.comments[commentIx] === 'object') {
              const newEntity = { data: currentEntity.comments[commentIx], next: null };
              tail.next = newEntity;
              tail = newEntity;
            }
          }

          break;
        case 'Summary':
          if (currentEntity.comments) {
            for (let commentIx = 0; commentIx < currentEntity.comments.length; commentIx += 1) {
              if (typeof currentEntity.comments[commentIx] === 'object') {
                const newEntity = { data: currentEntity.comments[commentIx], next: null };
                tail.next = newEntity;
                tail = newEntity;
              }
            }
          }

          break;
        case 'Sprint':
          sprintHandler(currentEntity);

          break;
        case 'Project':
          // TODO Project handler
          break;
        default:
          throw new Error('error: type of entity is invalid');
      }

      currentEntities = currentEntities.next;
    }
  }
  // TODO sprintId for all handlers and handling sprintId if needed

  const activeSprint = sprints.get(sprintId);
  if (typeof activeSprint === 'undefined') {
    throw new Error('error: active sprint did not find');
  }

  const userLikesArray = userLikes(users, likes, activeSprint);
  sortUserLikesArray(userLikesArray);

  const voteSlideData = votePrepareData(userLikesArray, activeSprint);

  const slides = [
    voteSlideData,
  ];

  return slides;
}

module.exports = {
  prepareData,
};
