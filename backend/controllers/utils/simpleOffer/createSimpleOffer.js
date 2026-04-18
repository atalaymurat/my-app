const Offer = require("../../../models/offer/Offer");
const generateNewDocCode = require("../generateNewCode");

async function createSimpleOffer(data) {
  let {
    company,
    contact,
    docType,
    createdBy,
    organization,
    title,
    ...versionData
  } = data;

  if (!company || !docType) {
    throw new Error("company ve docType zorunludur.");
  }

  // Basit teklif: sadece create, edit yok
  versionData.version = 1;
  versionData.docType = docType;
  versionData.docCode = generateNewDocCode({ type: docType, title, version: 1 });
  versionData.createdAt = new Date();

  const offer = new Offer({
    company,
    contact: contact || undefined,
    createdBy,
    organization,
    template: "simple",
    versions: [versionData],
  });

  await offer.save();
  return offer;
}

module.exports = createSimpleOffer;
