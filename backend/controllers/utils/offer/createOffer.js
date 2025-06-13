const Offer = require("../../../models/offer/Offer");
const generateNewDocCode = require("../generateNewCode");

async function createOffer(data) {
  let {
    _id,
    docCode,
    company,
    docType,
    user,
    title,
    version,
    ...versionData
  } = data;

  if (!company || !docType) {
    throw new Error("company ve docType zorunludur.");
  }

  let offer;

  if (_id) {
    // Edit modunda
    offer = await Offer.findById(_id).exec();
    if (!offer) throw new Error("Teklif bulunamadı.");

    const lastVersion = offer.versions[offer.versions.length - 1];
    const newVersionNumber = lastVersion?.version ? lastVersion.version + 1 : 1;

    versionData.version = newVersionNumber;
    versionData.createdAt = new Date();

    // Yeni docCode versiyonlu
    const newDocCode = generateNewDocCode({
      type: docType,
      title,
      version: newVersionNumber,
    });

    offer.docCode = newDocCode;  // docCode güncelle

    offer.versions.push(versionData);
  } else {
    // Yeni teklif
    versionData.version = 1;
    versionData.createdAt = new Date();

    if (!docCode) {
      docCode = generateNewDocCode({
        type: docType,
        title,
        version: 1,
      });
    }

    offer = new Offer({
      docCode,
      docType,
      company,
      user,
      versions: [versionData],
    });
  }

  await offer.save();

  return offer;
}

module.exports = createOffer;
