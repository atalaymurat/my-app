const Company = require("../models/company/Company");
const Contact = require("../models/contact/userContact");
const PriceList = require("../models/priceList/PriceList");
const logger = require("../config/logger");

const createSampleData = async (organizationId, userId) => {
  // 1. Sample PriceList varsa yeni org'u assignedOrgs'a ekle
  const samplePriceList = await PriceList.findOne({ isSample: true });
  if (samplePriceList) {
    await PriceList.updateOne(
      { _id: samplePriceList._id },
      { $addToSet: { assignedOrgs: organizationId } }
    );
  } else {
    logger.warn({ message: "No sample PriceList found — skipping assignment", organizationId });
  }

  // 2. Sample Company
  const company = await Company.create({
    title: "Örnek Mobilya A.Ş.",
    normalizedTitle: "ornek mobilya as",
    vatTitle: "ÖRNEK MOBİLYA ANONİM ŞİRKETİ",
    phones: ["+90 212 555 0000"],
    emails: ["info@ornek-mobilya.com"],
    domains: ["ornek-mobilya.com"],
    vd: "Kurumlar",
    vatNo: `SMPL-${organizationId.toString().slice(-10)}`,
    addresses: [{
      title: "Merkez",
      line1: "Örnek Mahallesi, Atatürk Caddesi No:1",
      city: "İstanbul",
      country: "Türkiye",
      zip: "34000",
    }],
    tags: ["örnek", "mobilya"],
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  // 3. Sample Contact
  const contact = await Contact.create({
    name: "Ahmet Yılmaz",
    normalizedName: "ahmet yilmaz",
    gender: "male",
    phones: ["+90 532 555 0000"],
    emails: ["ahmet@postiva.uk"],
    company: company._id,
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  return { company, contact, assignedPriceList: !!samplePriceList };
};

const deleteSampleData = async (organizationId) => {
  await Promise.all([
    Company.deleteMany({ organization: organizationId, isSample: true }),
    Contact.deleteMany({ organization: organizationId, isSample: true }),
  ]);

  // Sample PriceList'ten org'u çıkar (PriceList'i silme)
  await PriceList.updateMany(
    { isSample: true },
    { $pull: { assignedOrgs: organizationId } }
  );
};

module.exports = { createSampleData, deleteSampleData };
