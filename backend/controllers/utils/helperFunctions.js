const isEmpty = (val) => val === undefined || val === null || val === "";

const mergeArrays = (current = [], incoming = []) => {
  const unique = incoming.filter((val) => !current.includes(val));
  return unique.length > 0 ? [...current, ...unique] : null;
};

const mergeObjectArrays = (current = [], incoming = [], fields = []) => {
  const getKey = (obj) =>
    fields
      .map((f) => obj?.[f] ?? "")
      .join("|")
      .toLowerCase();

  const existingKeys = new Set(current.map(getKey));
  const newItems = incoming.filter((item) => !existingKeys.has(getKey(item)));

  return newItems.length > 0 ? [...current, ...newItems] : null;
};

const getFieldUpdates = (current, incoming) => {
  return !isEmpty(incoming) && current !== incoming ? incoming : null;
};
const isSameObject = (obj1, obj2, fields) => {
  return fields.every((field) => {
    const val1 = obj1[field]?.toString().trim().toLowerCase() || "";
    const val2 = obj2[field]?.toString().trim().toLowerCase() || "";
    return val1 === val2;
  });
};

const hasObjectInArray = (arr, target, fields) => {
  return arr.some((item) => isSameObject(item, target, fields));
};

const getUniqueObjects = (existing, incoming, fields) => {
  return incoming.filter((obj) => !hasObjectInArray(existing, obj, fields));
};

module.exports = {
  mergeArrays,
  mergeObjectArrays,
  getFieldUpdates,
  isEmpty,
  isSameObject,
  hasObjectInArray,
  getUniqueObjects,
};
