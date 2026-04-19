const Offer = require("../../../models/offer/Offer");
const generateNewDocCode = require("../generateNewCode");

async function createSimpleOffer(data) {
  let {
    _id,
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

  let offer;

  if (_id) {
    offer = await Offer.findById(_id).exec();
    if (!offer) throw new Error("Teklif bulunamadı.");

    const lastVersion = offer.versions[offer.versions.length - 1];
    const newVersionNumber = lastVersion?.version ? lastVersion.version + 1 : 1;

    versionData.version   = newVersionNumber;
    versionData.docType   = docType;
    versionData.docCode   = generateNewDocCode({ type: docType, title, version: newVersionNumber });
    versionData.createdAt = new Date();

    offer.company = company;
    if (contact !== undefined) offer.contact = contact;
    offer.versions.push(versionData);
  } else {
    versionData.version   = 1;
    versionData.docType   = docType;
    versionData.docCode   = generateNewDocCode({ type: docType, title, version: 1 });
    versionData.createdAt = new Date();

    offer = new Offer({
      company,
      contact: contact || undefined,
      createdBy,
      organization,
      template: "simple",
      offerType: "simple",
      versions: [versionData],
    });
  }

  await offer.save();
  return offer;
}

module.exports = createSimpleOffer;
