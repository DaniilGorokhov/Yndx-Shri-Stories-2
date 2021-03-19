const { users, userHandler } = require('./entityHandlers/userHandler');
const { likes, commentHandler } = require('./entityHandlers/commentHandler');
const { sprints, activeSprint, sprintHandler } = require('./entityHandlers/sprintHandler');
const { commits, commitHandler } = require('./entityHandlers/commitHandler');
const { summaries, commitSummaries, summaryHandler } = require('./entityHandlers/summaryHandler');

const { userLikes } = require('./helpers/dataHandlers/userLikes');
const { sortByProperty } = require('./helpers/dataHandlers/sortByProperty');
const { sprintCommits } = require('./helpers/dataHandlers/sprintCommits');
const { userCommits } = require('./helpers/dataHandlers/userCommits');
const { computeStatistics } = require('./helpers/dataHandlers/computeStatistics');
const { computeHeatMap } = require('./helpers/dataHandlers/computeHeatMap');

const { votePrepareData } = require('./slidesPrepareData/votePrepareData');
const { leadersPrepareData } = require('./slidesPrepareData/leadersPrepareData');
const { chartPrepareData } = require('./slidesPrepareData/chartPrepareData');
const { diagramPrepareData } = require('./slidesPrepareData/diagramPrepareData');
const { activityPrepareData } = require('./slidesPrepareData/activityPrepareData');

function prepareData(entities, { sprintId }) {
  // this variable need to retain order of handling users for order.
  const usersOrder = new Map();
  let orderValue = 0;
  let handledUserId;

  for (let entityIx = 0; entityIx < entities.length; entityIx += 1) {
    const entity = entities[entityIx];

    // currentEntities - linked list.
    // It is used to avoid handling nested entities by using recursion.
    let currentEntities = { data: entity, next: null };
    let tail = currentEntities;

    while (currentEntities !== null) {
      const currentEntity = currentEntities.data;

      switch (currentEntity.type) {
        case 'User':
          handledUserId = userHandler(currentEntity);

          // Save user order
          if (!usersOrder.has(handledUserId)) {
            usersOrder.set(handledUserId, orderValue);
          }

          break;
        case 'Comment':
          commentHandler(currentEntity);

          break;
        case 'Commit':
          commitHandler(currentEntity);

          break;
        case 'Issue':
          break;
        case 'Summary':
          summaryHandler(currentEntity);

          break;
        case 'Sprint':
          sprintHandler(currentEntity, sprintId);

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
      const withMulNestedEntities = [
        'friends', 'comments', 'commits', 'issues', 'dependencies', 'likes', 'summaries',
      ];

      for (let propertyIx = 0; propertyIx < withMulNestedEntities.length; propertyIx += 1) {
        const property = withMulNestedEntities[propertyIx];

        if (currentEntity[property]) {
          for (let ix = 0; ix < currentEntity[property].length; ix += 1) {
            if (typeof currentEntity[property][ix] === 'object') {
              const newEntity = { data: currentEntity[property][ix], next: null };
              tail.next = newEntity;
              tail = newEntity;
            }

            // Wiring commitId and summaryIds.
            if (property === 'summaries') {
              let summaryId = currentEntity[property][ix];
              if (typeof summaryId === 'object') {
                summaryId = summaryId.id;
              }

              if (commitSummaries.has(currentEntity.id)) {
                const currentSummaries = commitSummaries.get(currentEntity.id);
                currentSummaries.push(summaryId);
              } else {
                commitSummaries.set(currentEntity.id, [summaryId]);
              }
            }

            if (property === 'friends' || property === 'likes') {
              if (typeof currentEntity[property][ix] === 'object') {
                handledUserId = currentEntity[property][ix].id;
              } else {
                handledUserId = currentEntity[property][ix];
              }

              if (!usersOrder.has(handledUserId)) {
                usersOrder.set(handledUserId, orderValue);
                orderValue += 1;
              }
            }
          }
        }
      }

      const withSingNestedEntities = [
        'author', 'resolvedBy',
      ];

      for (let propertyIx = 0; propertyIx < withSingNestedEntities.length; propertyIx += 1) {
        const property = withSingNestedEntities[propertyIx];

        if (currentEntity[property]) {
          if (typeof currentEntity[property] === 'object') {
            const newEntity = { data: currentEntity[property], next: null };
            tail.next = newEntity;
            tail = newEntity;

            handledUserId = currentEntity[property].id;
          } else {
            handledUserId = currentEntity[property];
          }

          if (!usersOrder.has(handledUserId)) {
            usersOrder.set(handledUserId, orderValue);
            orderValue += 1;
          }
        }
      }

      currentEntities = currentEntities.next;
    }
  }

  if (Object.keys(activeSprint).length === 0) {
    throw new Error('error: active sprint did not find');
  }

  // chart slide
  sortByProperty({
    array: sprints,
    propertyForSort: 'id',
  });

  const { sprintCommitsArray, activeCommits, previousCommits } = sprintCommits(sprints, commits);

  // vote slide
  const userCommitsArray = userCommits(users, activeCommits);
  sortByProperty({
    array: userCommitsArray,
    propertyForSort: 'valueText',
    descending: true,
    // uniqueSortMap: usersOrder,
  });

  // leaders slide
  const userLikesArray = userLikes(users, likes, activeSprint);
  sortByProperty({
    array: userLikesArray,
    propertyForSort: 'valueText',
    descending: true,
    // uniqueSortMap: usersOrder,
  });

  // diagram slide
  const [
    activeStatistics, previousStatistics,
  ] = computeStatistics({
    sprints: [activeCommits, previousCommits],
    summaries,
    commitSummaries,
  });

  // activity slide
  const heatMapData = computeHeatMap(activeCommits);

  const leadersSlideData = leadersPrepareData(userCommitsArray, activeSprint);
  const voteSlideData = votePrepareData(userLikesArray, activeSprint);
  const chartSlideData = chartPrepareData(sprintCommitsArray, userCommitsArray, activeSprint);
  const diagramSlideData = diagramPrepareData(activeStatistics, previousStatistics, activeSprint);
  const activitySlideData = activityPrepareData(heatMapData, activeSprint);

  const slides = [
    leadersSlideData,
    voteSlideData,
    chartSlideData,
    diagramSlideData,
    activitySlideData,
  ];

  return slides;
}

module.exports = {
  prepareData,
};
