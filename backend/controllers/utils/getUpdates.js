const {
  mergeArrays,
  mergeObjectArrays,
  getFieldUpdates,
} = require("./helperFunctions");


const getUpdates = (existingData, newData, fieldsToCompare) => {
  const updates = {};

  for (const { field, value, merge, objectFields } of fieldsToCompare) {
    const newValue = newData[field];  // Use newData to get the current new value for the field

    if (merge) {
      const current = existingData[field] || [];
      const merged = objectFields
        ? mergeObjectArrays(current, newValue, objectFields)
        : mergeArrays(current, newValue);

      if (merged !== null && !arraysEqual(current, merged)) {
        updates[field] = merged;
      }
    } else {
      const current = existingData[field];
      const updated = getFieldUpdates(current, newValue);

      if (updated !== null && current !== updated) {
        updates[field] = updated;
      }
    }
  }

  return Object.keys(updates).length > 0 ? updates : null;
};

// Helper function to check if two arrays are equal
const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

module.exports = getUpdates;
