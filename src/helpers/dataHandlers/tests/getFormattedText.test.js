const { getFormattedText } = require('../getFormattedText');

describe('getVotesText function tests', () => {
  test('return right end of word with passed number % 10 == 1', () => {
    const params = [1, 101, 21];

    for (let paramsIx = 0; paramsIx < params.length; paramsIx += 1) {
      const result = getFormattedText(
        params[paramsIx],
        'голос',
        {
          one: '',
          twoFive: 'а',
          other: 'ов',
        },
      );
      expect(result).toBe(`${params[paramsIx]} голос`);
    }
  });

  test('return right end of word with passed number % 10 in the range from 2 to 4', () => {
    const params = [2, 3, 4, 22, 103, 44];

    for (let paramsIx = 0; paramsIx < params.length; paramsIx += 1) {
      const result = getFormattedText(
        params[paramsIx],
        'голос',
        {
          one: '',
          twoFive: 'а',
          other: 'ов',
        },
      );
      expect(result).toBe(`${params[paramsIx]} голоса`);
    }
  });

  test('return right end of word with passed number % 10 in the range from 5 to 9 or 0', () => {
    const params = [5, 6, 7, 8, 9, 0, 35, 46, 57, 68, 79, 110];

    for (let paramsIx = 0; paramsIx < params.length; paramsIx += 1) {
      const result = getFormattedText(
        params[paramsIx],
        'голос',
        {
          one: '',
          twoFive: 'а',
          other: 'ов',
        },
      );
      expect(result).toBe(`${params[paramsIx]} голосов`);
    }
  });

  test('return right end of word with passed number % 100 - number % 10 == 10', () => {
    for (let number = 10; number < 20; number += 1) {
      expect(getFormattedText(
        number,
        'голос',
        {
          one: '',
          twoFive: 'а',
          other: 'ов',
        },
      )).toBe(`${number} голосов`);
      expect(getFormattedText(
        number + 100,
        'голос',
        {
          one: '',
          twoFive: 'а',
          other: 'ов',
        },
      )).toBe(`${number + 100} голосов`);
    }
  });

  test('passed valueHandler handle value after choose end of word', () => {
    const params = [5, 0, 10, 8];

    for (let paramsIx = 0; paramsIx < params.length; paramsIx += 1) {
      const result = getFormattedText(
        params[paramsIx],
        'коммит',
        {
          one: '',
          twoFive: 'а',
          other: 'ов',
        },
        {
          valueHandler: (value) => value + 1,
        },
      );
      expect(result).toBe(`${params[paramsIx] + 1} коммитов`);
    }
  });

  test('interact with absolute value if passed value is negative', () => {
    const params = [-3, -1, -11, -9];
    const expectedWords = [
      'коммита',
      'коммит',
      'коммитов',
      'коммитов',
    ];

    for (let ix = 0; ix < params.length; ix += 1) {
      const result = getFormattedText(
        params[ix],
        'коммит',
        {
          one: '',
          twoFive: 'а',
          other: 'ов',
        },
        {
          valueHandler: (value) => value + 1,
        },
      );
      expect(result).toBe(`${params[ix] + 1} ${expectedWords[ix]}`);
    }
  });
});
