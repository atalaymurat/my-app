const mongoose = require("mongoose");
const Address = require("../models/company/AddressSchema"); // Your Address model
const { slugify } = require("transliteration");
const { connectDB, closeDB, clearDB } = require("./test-utils");


jest.setTimeout(20000); // Timeout increased to 20 seconds to handle Mongoose operations




describe("Address Schema Tests", () => {
  let AddressModel;

  // Connect to a test database before running the tests
  beforeAll(async () => {
    connectDB()
    AddressModel = mongoose.model("Address", Address);
  });

  // Cleanup after all tests
  afterAll(async () => {
    closeDB()
    clearDB()
  });

  // Test: Adres kaydının normalize edilmesi
  it("should normalize city, district, and country", async () => {
    const addressData = {
      city: "İstanbul",
      district: "Kadıköy",
      country: "Türkiye",
      line1: "Example street",
      line2: "2nd floor",
    };

    const address = new AddressModel(addressData);
    await address.save();

    const savedAddress = await AddressModel.findById(address._id);

    expect(savedAddress.normalizedCity).toBe(slugify("İstanbul"));
    expect(savedAddress.normalizedDistrict).toBe(slugify("Kadıköy"));
    expect(savedAddress.normalizedCountry).toBe(slugify("Türkiye"));
  });

  // Test: Adresin doğru şekilde kaydedilmesi
  it("should save address correctly", async () => {
    const addressData = {
      city: "Ankara",
      district: "Çankaya",
      country: "Türkiye",
      line1: "Example street",
      line2: "3rd floor",
    };

    const address = new AddressModel(addressData);
    await address.save();

    const savedAddress = await AddressModel.findOne({ city: "Ankara" });
    expect(savedAddress).toBeTruthy();
    expect(savedAddress.city).toBe("Ankara");
    expect(savedAddress.district).toBe("Çankaya");
    expect(savedAddress.country).toBe("Türkiye");
  });
});
