const assert = require('assert').strict;

const input = require('./input.json');
const output = require('./output.json');

const { computeHeatMap } = require('../src/helpers/dataHandlers/computeHeatMap');

const activeCommits = [];

for (let entityIx = 0; entityIx < input.length; entityIx += 1) {
  const entity = input[entityIx];

  if (entity.type === 'Commit') {
    if (entity.timestamp >= 1603573502000 && entity.timestamp <= 1604178302000) {
      activeCommits.push(entity);
    }
  }

  if (entity.commits) {
    entity.commits.forEach((commit) => {
      if (typeof commit === 'object') input.push(commit);
    });
  }
}

const heatMapData = computeHeatMap(activeCommits);

const expectedHeatMapData = output[4].data.data;

const errorMessages = [];
try {
  assert.deepStrictEqual(heatMapData, expectedHeatMapData);
} catch (error) {
  errorMessages.push(error.message);
}

if (errorMessages.length) {
  console.log(errorMessages.join('\n\n\n'));
} else {
  console.log('Test OK!');
}

// TODO fix check
