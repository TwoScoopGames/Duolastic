function serialize(game, entity, components) {
  var obj = {
    id: entity
  };

  for (var i = 0; i < components.length; i++) {
    var component = components[i];
    obj[component] = game.entities.getComponent(entity, component);
  }
  return obj;
}

function deserialize(game, entity) {
  var keys = Object.keys(entity);

  for (var i = 0; i < keys.length; i++) {
    if (keys[i] === "id") {
      continue;
    }
    var component = game.entities.getComponent(entity.id, keys[i]);
    merge(component, entity[keys[i]]);
  }
}

function merge(dest, src) {
  var keys = Object.keys(src);

  for (var i = 0; i < keys.length; i++) {
    dest[keys[i]] = src[keys[i]];
  }
}

module.exports = {
  deserialize: deserialize,
  serialize: serialize
};
