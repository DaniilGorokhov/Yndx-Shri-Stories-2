const { LinkedList } = require('./helpers/mainFlow/LinkedList');
const { UniquenessStorage } = require('./helpers/mainFlow/UniquenessStorage');
const { Storage } = require('./helpers/mainFlow/Storage');

const { userHandler } = require('./entityHandlers/userHandler');
const { commentHandler } = require('./entityHandlers/commentHandler');
const { commitHandler } = require('./entityHandlers/commitHandler');
const { sprintHandler } = require('./entityHandlers/sprintHandler');
const { summaryHandler } = require('./entityHandlers/summaryHandler');

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
  const storage = new Storage();

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
            userHandler(currentEntity, storage.users);

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
            commentHandler(currentEntity, storage.likes);

            linkedListIns.handleProperty({
              property: 'author',
              type: 'not array-like',
            });

            linkedListIns.handleProperty({
              property: 'likes',
            });

            break;
          case 'Commit':
            commitHandler(currentEntity, storage.commits, storage.commitSummaries);

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
            summaryHandler(currentEntity, storage.summaries);

            if (currentEntity.comments) {
              linkedListIns.handleProperty({
                property: 'comments',
              });
            }

            break;
          case 'Sprint':
            sprintHandler(currentEntity, sprintId, storage.sprints, storage.activeSprint);

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
      }

      uniqStorage.add(type, currentEntity.id);

      linkedListIns.next();
    }
  }

  if (typeof storage.activeSprint.data === 'undefined') {
    throw new Error('error: active sprint did not find');
  }

  // chart slide
  sortByProperty({
    array: storage.sprints,
    propertyForSort: 'id',
  });

  const {
    sprintCommitsArray,
    activeCommits,
    previousCommits,
  } = sprintCommits(storage.sprints, storage.commits);

  // vote slide
  const userCommitsArray = userCommits(storage.users, activeCommits);
  sortByProperty({
    array: userCommitsArray,
    propertyForSort: 'valueText',
    descending: true,
  });

  // leaders slide
  const userLikesArray = userLikes(storage.users, storage.likes, storage.activeSprint.data);
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
    summaries: storage.summaries,
    commitSummaries: storage.commitSummaries,
  });

  // activity slide
  const heatMapData = computeHeatMap(activeCommits);

  const leadersSlideData = leadersPrepareData(userCommitsArray, storage.activeSprint.data);
  const voteSlideData = votePrepareData(userLikesArray, storage.activeSprint.data);
  const chartSlideData = chartPrepareData(
    sprintCommitsArray,
    userCommitsArray,
    storage.activeSprint.data,
  );
  const diagramSlideData = diagramPrepareData(
    activeStatistics,
    previousStatistics,
    storage.activeSprint.data,
    activeCommits.length,
    previousCommits.length,
  );
  const activitySlideData = activityPrepareData(heatMapData, storage.activeSprint.data);

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
