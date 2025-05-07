

const mongoose = require("mongoose");

describe("MongoDB Atlas Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "test",
    });
  }, 15000); // 15 saniye timeout

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should connect to MongoDB Atlas successfully", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});