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
const expectedVoteOutput = expectedOutput.find((item) => item.alias === 'vote');
const receivedVoteOutput = result.find((item) => item.alias === 'vote');

assert.deepStrictEqual(expectedVoteOutput, receivedVoteOutput);
