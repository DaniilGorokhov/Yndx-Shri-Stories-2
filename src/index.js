const { users, userHandler } = require('./entityHandlers/userHandler');
const { likes, commentHandler } = require('./entityHandlers/commentHandler');
const { sprints, sprintHandler } = require('./entityHandlers/sprintHandler');
const { commits, commitHandler } = require('./entityHandlers/commitHandler');

const { votePrepareData } = require('./slidesPrepareData/votePrepareData');
const { leadersPrepareData } = require('./slidesPrepareData/leadersPrepareData');

const { userLikes } = require('./helpers/dataHandlers/userLikes');
const { sortDescByValueText } = require('./helpers/dataHandlers/sortDescByValueText');
const { userCommits } = require('./helpers/dataHandlers/userCommits');

function prepareData(entities, { sprintId }) {
  for (let entityIx = 0; entityIx < entities.length; entityIx += 1) {
    const entity = entities[entityIx];

    // currentEntities - linked list.
    // It is used to avoid handling nested entities by using recursion
    let currentEntities = { data: entity, next: null };
    let tail = currentEntities;

    while (currentEntities !== null) {
      const currentEntity = currentEntities.data;

      switch (currentEntity.type) {
        case 'User':
          userHandler(currentEntity);

          break;
        case 'Comment':
          if (typeof currentEntity.author === 'object') {
            userHandler(currentEntity.author);
          }

          commentHandler(currentEntity);

          break;
        case 'Commit':
          if (typeof currentEntity.author === 'object') {
            userHandler(currentEntity.author);
          }

          commitHandler(currentEntity);

          break;
        case 'Issue':
          if (currentEntity.resolvedBy && typeof currentEntity.resolvedBy === 'object') {
            userHandler(currentEntity.resolvedBy);
          }

          break;
        case 'Summary':
          break;
        case 'Sprint':
          sprintHandler(currentEntity);

          break;
        case 'Project':
          break;
        default:
          throw new Error('error: type of entity is invalid');
      }

      // Here we check properties, which can contain nested entities
      // like user.friends, that can contain other user entity.
      // If they contain entity, it add to linked list and handling in further by cycle.
      // It taken out, since else we should repeat same block for different properties.
      const withNestedEntities = [
        'friends', 'comments', 'commits', 'issues', 'dependencies', 'likes', 'summaries',
      ];
      // TODO summaries handling
      for (let propertyIx = 0; propertyIx < withNestedEntities.length; propertyIx += 1) {
        const property = withNestedEntities[propertyIx];
        if (currentEntity[property]) {
          for (let ix = 0; ix < currentEntity[property].length; ix += 1) {
            if (typeof currentEntity[property][ix] === 'object') {
              const newEntity = { data: currentEntity[property][ix], next: null };
              tail.next = newEntity;
              tail = newEntity;
            }
          }
        }
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
  sortDescByValueText(userLikesArray);

  const userCommitsArray = userCommits(users, commits, activeSprint);
  sortDescByValueText(userCommitsArray);

  const voteSlideData = votePrepareData(userLikesArray, activeSprint);
  const leadersSlideData = leadersPrepareData(userCommitsArray, activeSprint);

  const slides = [
    leadersSlideData,
    voteSlideData,
  ];

  return slides;
}

module.exports = {
  prepareData,
};
