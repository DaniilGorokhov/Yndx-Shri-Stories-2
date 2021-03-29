const { Storage } = require('../Storage');

describe('Storage class tests', () => {
  test('users property is instance of Map', () => {
    const storage = new Storage();

    expect(storage.users).toBeInstanceOf(Map);
  });

  test('likes property is instance of Map', () => {
    const storage = new Storage();

    expect(storage.likes).toBeInstanceOf(Map);
  });

  test('sprints property is instance of Array', () => {
    const storage = new Storage();

    expect(storage.sprints).toBeInstanceOf(Array);
  });

  test('activeSprint property is pure object', () => {
    const storage = new Storage();

    expect(storage.activeSprint).toStrictEqual({});
  });

  test('commits property is instance of Array', () => {
    const storage = new Storage();

    expect(storage.commits).toBeInstanceOf(Array);
  });

  test('commitSummaries property is instance of Map', () => {
    const storage = new Storage();

    expect(storage.commitSummaries).toBeInstanceOf(Map);
  });

  test('summaries property is instance of Map', () => {
    const storage = new Storage();

    expect(storage.summaries).toBeInstanceOf(Map);
  });

  test('after initStorage method invoking all storages are cleaned', () => {
    const storage = new Storage();

    storage.users.set(123, { id: 123, type: 'user' });
    storage.likes.set(123, { id: 123, type: 'like' });
    storage.sprints.push({ id: 123, type: 'sprint' });
    Object.assign(storage.activeSprint, {
      data: { type: 'active sprint' },
    });
    storage.commits.push({ id: 123, type: 'commit' });
    storage.commitSummaries.set(123, [123]);
    storage.summaries.set(123, { id: 123, type: 'summary' });

    storage.initStorage();

    expect(storage.users.size).toBe(0);
    expect(storage.likes.size).toBe(0);
    expect(storage.sprints).toHaveLength(0);
    expect(storage.activeSprint).toStrictEqual({});
    expect(storage.commits).toHaveLength(0);
    expect(storage.commitSummaries.size).toBe(0);
    expect(storage.summaries.size).toBe(0);
  });
});
