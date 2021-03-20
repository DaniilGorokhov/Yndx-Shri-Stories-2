class LinkedList {
  constructor(entity) {
    this.entities = { data: entity, next: null };
    this.tail = this.entities;
  }

  next() {
    this.entities = this.entities.next;
  }

  add(entity) {
    const newEntity = { data: entity, next: null };
    this.tail.next = newEntity;
    this.tail = newEntity;
  }

  handleProperty({
    property, // property to handle
    type = 'array-like', // 'array-like' | 'not array-like'
  }) {
    const { data } = this.entities;

    if (type === 'array-like') {
      for (let ix = 0; ix < data[property].length; ix += 1) {
        if (typeof data[property][ix] === 'object') {
          this.add(data[property][ix]);
        }
      }
    } else if (type === 'not array-like') {
      if (typeof data[property] === 'object') {
        this.add(data[property]);
      }
    } else {
      throw new Error('error: invalid type. type can be \'array-like\' or \'not array-like\'');
    }
  }
}

module.exports = {
  LinkedList,
};
