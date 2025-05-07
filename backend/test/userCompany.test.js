const mongoose = require("mongoose");
const UserCompany = require("../models/company/UserCompany"); // Adjust path if needed
const { connectDB, closeDB, clearDB } = require("./test-utils");

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});


describe("UserCompany Model Tests", () => {
  it("should create a user company successfully", async () => {
    const userCompanyData = {
      user: new mongoose.Types.ObjectId(), // Use 'new' here
      company: new mongoose.Types.ObjectId(), // Use 'new' here
      customTitle: "Custom Title",
      notes: "This is a note",
      userEmails: ["user@example.com"],
      userPhones: ["+905551234567"],
      itemCode: "ABC123",
      tags: ["important", "client"],
    };

    const userCompany = await UserCompany.create(userCompanyData);

    expect(userCompany.customTitle).toBe("Custom Title");
    expect(userCompany.notes).toBe("This is a note");
    expect(userCompany.userEmails[0]).toBe("user@example.com");
    expect(userCompany.userPhones[0]).toBe("+905551234567");
    expect(userCompany.itemCode).toBe("ABC123");
    expect(userCompany.tags).toContain("important");
  });

  it("should not allow duplicate user and company combination", async () => {
    const userId = new mongoose.Types.ObjectId(); // Use 'new' here
    const companyId = new mongoose.Types.ObjectId(); // Use 'new' here

    await UserCompany.create({
      user: userId,
      company: companyId,
      customTitle: "First Company",
    });

    await expect(
      UserCompany.create({
        user: userId,
        company: companyId,
        customTitle: "Duplicate Company",
      })
    ).rejects.toThrow("E11000 duplicate key error collection");
  });

  it("should allow different user and company combinations", async () => {
    const userId1 = new mongoose.Types.ObjectId(); // Use 'new' here
    const userId2 = new mongoose.Types.ObjectId(); // Use 'new' here
    const companyId1 = new mongoose.Types.ObjectId(); // Use 'new' here
    const companyId2 = new mongoose.Types.ObjectId(); // Use 'new' here

    const userCompany1 = await UserCompany.create({
      user: userId1,
      company: companyId1,
      customTitle: "User1 - Company1",
    });

    const userCompany2 = await UserCompany.create({
      user: userId2,
      company: companyId2,
      customTitle: "User2 - Company2",
    });

    expect(userCompany1.customTitle).toBe("User1 - Company1");
    expect(userCompany2.customTitle).toBe("User2 - Company2");
  });

  it("should allow adding multiple userEmails, userPhones, and tags", async () => {
    const userCompanyData = {
      user: new mongoose.Types.ObjectId(), // Use 'new' here
      company: new mongoose.Types.ObjectId(), // Use 'new' here
      userEmails: ["user1@example.com", "user2@example.com"],
      userPhones: ["+905551234567", "+905552345678"],
      tags: ["important", "urgent"],
    };

    const userCompany = await UserCompany.create(userCompanyData);

    expect(userCompany.userEmails.length).toBe(2);
    expect(userCompany.userPhones.length).toBe(2);
    expect(userCompany.tags.length).toBe(2);
    expect(userCompany.userEmails).toContain("user2@example.com");
    expect(userCompany.userPhones).toContain("+905552345678");
  });

  it("should not create a user company without a user and company", async () => {
    const userCompanyData = {
      customTitle: "No User or Company",
    };

    await expect(UserCompany.create(userCompanyData)).rejects.toThrow();
  });
});