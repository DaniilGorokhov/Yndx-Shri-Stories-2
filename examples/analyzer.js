const entities = require('./input.json');

const types = new Map();

for (let entityIx = 0; entityIx < entities.length; entityIx += 1) {
  const entity = entities[entityIx];

  if (typeof entity === 'object') {
    if (!types.has(entity.type)) {
      const newType = {
        type: entity.type,
      };

      types.set(entity.type, newType);
    }

    const currentType = types.get(entity.type);

    const keys = Object.keys(entity);
    for (let keyIx = 0; keyIx < keys.length; keyIx += 1) {
      const key = keys[keyIx];

      if (!currentType[key]) {
        currentType[key] = typeof entity[key];
      }

      if (typeof entity[key] === 'object') {
        if (Array.isArray(entity[key])) {
          for (let ix = 0; ix < entity[key].length; ix += 1) {
            entities.push(entity[key][ix]);
          }
        } else if (entity[key] !== null) {
          entities.push(entity[key]);
        }
      }
    }
  }
}

types.forEach((value, key) => {
  console.log(key, value, '\n');
});
