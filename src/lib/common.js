export function hasNestedProperty(base, path) {
  var current = base;
  var components = path.split(".");
  for (var i = 0; i < components.length; i++) {
    if ((typeof current !== "object") || (!current.hasOwnProperty(components[i]))) {
      return false;
    }
    current = current[components[i]];
  }
  return true;
}