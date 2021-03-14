const { getVotesText } = require('../getVotesText');

describe('getVotesText function tests', () => {
  test('return right end of word with passed number % 10 == 1', () => {
    const params = [1, 101, 21];

    for (let paramsIx = 0; paramsIx < params.length; paramsIx += 1) {
      const result = getVotesText(params[paramsIx]);
      expect(result).toBe(`${params[paramsIx]} голос`);
    }
  });

  test('return right end of word with passed number % 10 in the range from 2 to 4', () => {
    const params = [2, 3, 4, 22, 103, 44];

    for (let paramsIx = 0; paramsIx < params.length; paramsIx += 1) {
      const result = getVotesText(params[paramsIx]);
      expect(result).toBe(`${params[paramsIx]} голоса`);
    }
  });

  test('return right end of word with passed number % 10 in the range from 5 to 9 or 0', () => {
    const params = [5, 6, 7, 8, 9, 0, 35, 46, 57, 68, 79, 110];

    for (let paramsIx = 0; paramsIx < params.length; paramsIx += 1) {
      const result = getVotesText(params[paramsIx]);
      expect(result).toBe(`${params[paramsIx]} голосов`);
    }
  });

  test('return right end of word with passed number % 100 - number % 10 == 10', () => {
    for (let number = 10; number < 20; number += 1) {
      expect(getVotesText(number)).toBe(`${number} голосов`);
      expect(getVotesText(number + 100)).toBe(`${number + 100} голосов`);
    }
  });
});
