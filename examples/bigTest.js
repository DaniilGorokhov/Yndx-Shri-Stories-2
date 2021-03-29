// This module is big test for prepareData function.
// Function from source is tested.
// As input is used input.json; expected output - output.json;
// received output save in output.dev.json; outputs are compared by assert.deepStrictEqual
const fs = require('fs');
const assert = require('assert').strict;

const input = require('./input.json');
const expectedOutput = require('./output.json');

const { prepareData } = require('../src/index');

const result = prepareData(input, { sprintId: 977 });
const resultAsString = JSON.stringify(
  result,
  null,
  '  ',
);

fs.writeFile('./examples/output.dev.json', resultAsString, (error) => {
  if (error) throw error;
});

// If there are difference, will be outputted error message
const errorMessages = [];

try {
  const expectedLeadersOutput = expectedOutput[0];
  const receivedLeadersOutput = result[0];

  assert.deepStrictEqual(receivedLeadersOutput, expectedLeadersOutput);
} catch (error) {
  errorMessages.push(error.message);
}

try {
  const expectedVoteOutput = expectedOutput[1];
  const receivedVoteOutput = result[1];

  assert.deepStrictEqual(receivedVoteOutput, expectedVoteOutput);
} catch (error) {
  errorMessages.push(error.message);
}

try {
  const expectedChartOutput = expectedOutput[2];
  const receivedChartOutput = result[2];

  assert.deepStrictEqual(receivedChartOutput, expectedChartOutput);
} catch (error) {
  errorMessages.push(error.message);
}

try {
  const expectedDiagramOutput = expectedOutput[3];
  const receivedDiagramOutput = result[3];

  assert.deepStrictEqual(receivedDiagramOutput, expectedDiagramOutput);
} catch (error) {
  errorMessages.push(error.message);
}

try {
  const expectedActivityOutput = expectedOutput[4];
  const receivedActivityOutput = result[4];

  assert.deepStrictEqual(receivedActivityOutput, expectedActivityOutput);
} catch (error) {
  errorMessages.push(error.message);
}

if (errorMessages.length) {
  console.log(errorMessages.join('\n\n\n'));
} else {
  console.log('Tests OK!');
}
