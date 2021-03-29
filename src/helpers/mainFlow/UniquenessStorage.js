class UniquenessStorage {
  constructor(types) {
    this.storage = {};
    this.typesSet = new Set();

    for (let typeIx = 0; typeIx < types.length; typeIx += 1) {
      const type = types[typeIx];

      this.storage[type] = new Set();
      this.typesSet.add(type);
    }
  }

  // Return true if storage[type] has not id, else return false.
  // Adding will be only if it is returned true.
  add(type, id) {
    if (this.typesSet.has(type)) {
      const wasInStorage = this.has(type, id);

      this.storage[type].add(id);

      // Inverse, since if id was not in storage we add this id successfully
      return !wasInStorage;
    }
    return false;
  }

  // Return false if type does not exist or if storage has not passed id, else return true.
  has(type, id) {
    if (this.typesSet.has(type)) {
      return this.storage[type].has(id);
    }
    return false;
  }
}

module.exports = {
  UniquenessStorage,
};
