const mongoose = require("mongoose");
const { Company } = require("../models/company/Company"); // Adjust the path to your Company model
const {
  formatDomain,
} = require("../models/company/Company"); // Assuming these functions are exported

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
  // Test domain formatting
  it("should format domains correctly", () => {
    const domains = [
      "www.domain.com", // with www
      "Example.com/", // without www
      "http://testsite.org", // without www
    ];

    const formattedDomains = domains.map(formatDomain);

    expect(formattedDomains).toEqual([
      "domain.com", // Domain without "www."
      "example.com", // Lowercased domain
      "testsite.org", // Domain remains unchanged
    ]);
  });

  // Test: Create company and check formatted domains
  it("should create a company with formatted domains", async () => {
    const companyData = {
      title: "Test Company",
      domains: [
        "www.example.com", // with www
        "TESTsite.org", // mixed case
      ],
    };

    // Create company
    const company = new Company(companyData);

    // Save company to the database
    await company.save();

    // Retrieve the saved company from the database
    const savedCompany = await Company.findById(company._id);

    // Test if domains are correctly formatted
    expect(savedCompany.domains).toEqual([
      "example.com", // Lowercased and without "www."
      "testsite.org", // Correct domain format
    ]);
  });
});
