const { LinkedList } = require('../LinkedList');

describe('LinkedList class tests', () => {
  test('after initialization entities have properties data and next', () => {
    const entity = {};
    const linkedListIns = new LinkedList(entity);

    expect(linkedListIns.entities).toHaveProperty('data');
    expect(linkedListIns.entities).toHaveProperty('next');
  });

  test('after initialization in entities.data contains passed entity', () => {
    const entity = {};
    const linkedListIns = new LinkedList(entity);

    expect(linkedListIns.entities.data).toBe(entity);
  });

  test('add method add entity in tail of entities in next property', () => {
    const entity = {};
    const entityWithId = { id: 1 };
    const linkedListIns = new LinkedList(entity);

    linkedListIns.add(entityWithId);

    expect(linkedListIns.entities.next.data).toBe(entityWithId);
  });

  test('next method update entities by assignment this var to its next', () => {
    const entity = {};
    const entityWithId = { id: 1 };
    const linkedListIns = new LinkedList(entity);

    linkedListIns.add(entityWithId);
    linkedListIns.next();

    expect(linkedListIns.entities.data).toBe(entityWithId);
  });

  test('handle property of current entities.data and call add method if find objects '
  + '(by default property is treated as array-like)', () => {
    const entity = {
      nestedEntities: [
        { id: 1 },
        { id: 2 },
      ],
    };

    const linkedListIns = new LinkedList(entity);

    linkedListIns.handleProperty({
      property: 'nestedEntities',
    });

    linkedListIns.next();
    expect(linkedListIns.entities.data).toEqual({ id: 1 });
    linkedListIns.next();
    expect(linkedListIns.entities.data).toEqual({ id: 2 });
  });

  test('handle property of current entities.data and call add method '
    + 'if it is object (entities.data[property] if passed type as \'not array-like\'', () => {
    const entity = {
      withId: {
        id: 1,
      },
    };

    const linkedListIns = new LinkedList(entity);

    linkedListIns.handleProperty({
      property: 'withId',
      type: 'not array-like',
    });

    linkedListIns.next();
    expect(linkedListIns.entities.data).toEqual({ id: 1 });
  });

  test('throw error if type is invalid', () => {
    const entity = {};
    const linkedListIns = new LinkedList(entity);

    expect(() => linkedListIns.handleProperty({
      property: '',
      type: 'invalid type',
    })).toThrow('error: invalid type. type can be \'array-like\' or \'not array-like\'');
  });
});
