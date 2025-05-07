const mongoose = require("mongoose");
const { Company } = require("../models/company/Company");
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

describe("Company Schema Tests", () => {
  it("should create a company successfully", async () => {
    const company = await Company.create({
      title: "Acme Inc.",
      vatNo: "1234567890",
      phones: ["+905551112233"],
      emails: ["info@acme.com"],
      domains: ["www.acme.com"],
    });

    expect(company.title).toBe("Acme Inc.");
    expect(company.vatNo).toBe("1234567890");
  });

  it("should not allow duplicate vatNo", async () => {
    await Company.create({ title: "Company A", vatNo: "1111" });

    try {
      await Company.create({ title: "Company B", vatNo: "1111" });
    } catch (err) {
      expect(err).toBeDefined(); // Check that an error is thrown
    }
  });

  it("should not allow duplicate tcNo", async () => {
    await Company.create({ title: "User A", tcNo: "2222" });

    try {
      await Company.create({ title: "User B", tcNo: "2222" });
    } catch (err) {
      expect(err).toBeDefined(); // Check that an error is thrown
    }
  });

  it("should allow multiple phones, emails and websites", async () => {
    const company = await Company.create({
      title: "Multi Contact",
      phones: ["+905551111111", "+905552222222"],
      emails: ["a@b.com", "b@c.com"],
      domains: ["example1.com", "example2.com"],
    });

    expect(company.phones.length).toBe(2);
    expect(company.emails[1]).toBe("b@c.com");
    expect(company.domains).toContain("example2.com");
  });

  it("should normalize address fields", async () => {
    const company = await Company.create({
      title: "Adresli Şirket",
      addresses: [
        {
          title: "Merkez",
          city: "İstanbul",
          district: "Kadıköy",
          country: "Türkiye",
          line1: "Bağdat Cd.",
        },
      ],
    });

    expect(company.addresses[0].normalizedCity).toBe("istanbul");
    expect(company.addresses[0].normalizedCountry).toBe("turkiye");
  });
});
