const { UniquenessStorage } = require('../UniquenessStorage');

describe('UniquenessStorage class tests', () => {
  test('initialize storage with passed types', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    expect(Object.keys(uniquenessStorageIns.storage)).toHaveLength(types.length);
    for (let typeIx = 0; typeIx < types.length; typeIx += 1) {
      expect(uniquenessStorageIns.storage).toHaveProperty(types[typeIx]);
    }
  });

  test('each type in storage is a Set', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    for (let typeIx = 0; typeIx < types.length; typeIx += 1) {
      const type = types[typeIx];

      expect(uniquenessStorageIns.storage[type]).toBeInstanceOf(Set);
    }
  });

  test('\'add\' method add unique id only for passed type', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    uniquenessStorageIns.add('Commit', 1);
    uniquenessStorageIns.add('Commit', 2);

    expect(uniquenessStorageIns.storage.Commit.size).toBe(2);
    expect(uniquenessStorageIns.storage.User.size).toBe(0);
    expect(uniquenessStorageIns.storage.Sprint.size).toBe(0);
  });

  test('invoking of method \'add\' twice with same id for same type '
    + 'add this id only one time', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    uniquenessStorageIns.add('Commit', 1);
    uniquenessStorageIns.add('Commit', 1);

    expect(uniquenessStorageIns.storage.Commit.size).toBe(1);
  });

  test('\'add\' method return true if adding happened', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    expect(uniquenessStorageIns.add('Commit', 1)).toBe(true);
  });

  test('\'add\' method return false if adding did not happen and type is in storage', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    uniquenessStorageIns.add('Commit', 1);
    expect(uniquenessStorageIns.add('Commit', 1)).toBe(false);
  });

  test('\'add\' method return false if type is not in storage', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    expect(uniquenessStorageIns.add('invalid', 1)).toBe(false);
  });

  test('\'has\' method check having of id for passed type', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    expect(uniquenessStorageIns.has('Commit', 1)).toBe(false);

    uniquenessStorageIns.add('Commit', 1);
    expect(uniquenessStorageIns.has('Commit', 1)).toBe(true);

    expect(uniquenessStorageIns.has('User', 1)).toBe(false);
  });

  test('\'has\' method return false if passed type is not in storage', () => {
    const types = ['Commit', 'User', 'Sprint'];

    const uniquenessStorageIns = new UniquenessStorage(types);

    expect(uniquenessStorageIns.has('invalid', '123')).toBe(false);
  });
});
