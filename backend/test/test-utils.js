
// test/test-utils.js
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.test" });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

const closeDB = async () => {
  await mongoose.connection.dropDatabase(); // opsiyonel
  await mongoose.connection.close();
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = { connectDB, closeDB, clearDB };