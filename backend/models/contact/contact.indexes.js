module.exports = function applyContactIndexes(schema) {
  schema.index(
    { "emails.address": 1 },
    {
      unique: true,
      partialFilterExpression: { "emails.address": { $exists: true } },
    }
  );

  schema.index(
    { "phones.number": 1 },
    {
      unique: true,
      partialFilterExpression: { "phones.number": { $exists: true } },
    }
  );
};
