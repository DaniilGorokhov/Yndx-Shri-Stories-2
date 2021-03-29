const { LinkedList } = require('./helpers/mainFlow/LinkedList');
const { UniquenessStorage } = require('./helpers/mainFlow/UniquenessStorage');

const { users, userHandler } = require('./entityHandlers/userHandler');
const { likes, commentHandler } = require('./entityHandlers/commentHandler');
const { sprints, activeSprint, sprintHandler } = require('./entityHandlers/sprintHandler');
const { commits, commitSummaries, commitHandler } = require('./entityHandlers/commitHandler');
const { summaries, summaryHandler } = require('./entityHandlers/summaryHandler');

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
  const types = ['Project', 'User', 'Issue', 'Comment', 'Commit', 'Summary', 'Sprint'];
  const uniqStorage = new UniquenessStorage(types);

  for (let entityIx = 0; entityIx < entities.length; entityIx += 1) {
    const entity = entities[entityIx];

    const linkedListIns = new LinkedList(entity);

    while (linkedListIns.entities !== null) {
      const currentEntity = linkedListIns.entities.data;

      const { type } = currentEntity;
      if (!uniqStorage.has(type, currentEntity.id)) {
        switch (type) {
          case 'User':
            userHandler(currentEntity);

            linkedListIns.handleProperty({
              property: 'friends',
            });

            if (currentEntity.comments) {
              linkedListIns.handleProperty({
                property: 'comments',
              });
            }

            if (currentEntity.commits) {
              linkedListIns.handleProperty({
                property: 'commits',
              });
            }

            break;
          case 'Comment':
            commentHandler(currentEntity);

            linkedListIns.handleProperty({
              property: 'author',
              type: 'not array-like',
            });

            linkedListIns.handleProperty({
              property: 'likes',
            });

            break;
          case 'Commit':
            commitHandler(currentEntity);

            linkedListIns.handleProperty({
              property: 'author',
              type: 'not array-like',
            });

            linkedListIns.handleProperty({
              property: 'summaries',
            });

            break;
          case 'Issue':
            if (currentEntity.resolvedBy) {
              linkedListIns.handleProperty({
                property: 'resolvedBy',
                type: 'not array-like',
              });
            }

            linkedListIns.handleProperty({
              property: 'comments',
            });

            break;
          case 'Summary':
            summaryHandler(currentEntity);

            if (currentEntity.comments) {
              linkedListIns.handleProperty({
                property: 'comments',
              });
            }

            break;
          case 'Sprint':
            sprintHandler(currentEntity, sprintId);

            break;
          case 'Project':
            linkedListIns.handleProperty({
              property: 'dependencies',
            });

            linkedListIns.handleProperty({
              property: 'issues',
            });

            linkedListIns.handleProperty({
              property: 'commits',
            });

            break;
          default:
            throw new Error('error: type of entity is invalid');
        }

        uniqStorage.add(type, currentEntity.id);
      }

      linkedListIns.next();
    }
  }

  if (typeof activeSprint.data === 'undefined') {
    throw new Error('error: active sprint did not find');
  }

  // chart slide
  sortByProperty({
    array: sprints,
    propertyForSort: 'id',
  });

  const {
    sprintCommitsArray,
    activeCommits,
    previousCommits,
  } = sprintCommits(sprints, commits);

  // vote slide
  const userCommitsArray = userCommits(users, activeCommits);
  sortByProperty({
    array: userCommitsArray,
    propertyForSort: 'valueText',
    descending: true,
  });

  // leaders slide
  const userLikesArray = userLikes(users, likes, activeSprint.data);
  sortByProperty({
    array: userLikesArray,
    propertyForSort: 'valueText',
    descending: true,
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

  const leadersSlideData = leadersPrepareData(userCommitsArray, activeSprint.data);
  const voteSlideData = votePrepareData(userLikesArray, activeSprint.data);
  const chartSlideData = chartPrepareData(
    sprintCommitsArray,
    userCommitsArray,
    activeSprint.data,
  );
  const diagramSlideData = diagramPrepareData(
    activeStatistics,
    previousStatistics,
    activeSprint.data,
    activeCommits.length,
    previousCommits.length,
  );
  const activitySlideData = activityPrepareData(heatMapData, activeSprint.data);

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
