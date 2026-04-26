const axios = require("axios");
const Offer = require("../models/offer/Offer");
const offerDefaultsSeed = require("../utils/offerDefaultsSeed");
const normalizeSimpleOffer = require("./utils/simpleOffer/normalizeSimpleOffer");
const createSimpleOffer = require("./utils/simpleOffer/createSimpleOffer");
const { normalizeCompany } = require("./utils/normalize");
const { handleCompanyCreate } = require("./services/companyServices");


const createOrFindContact = require("./utils/contact/createOrFindContact");

const AUTH_BASE = process.env.AUTH_SERVICE_URL;

async function handleOfferFlow(req, res, statusCode, successMessage) {
  const userId = req.user?._id;
  const orgId  = req.user?.orgId || null;
  if (!userId) return res.status(401).json({ message: "Yetkisiz erişim.", success: false });

  const { offerData, versionData, needsCompanyCreation, companyData, contactData } =
    normalizeSimpleOffer(req.body, userId, orgId);

  if (needsCompanyCreation && companyData) {
    const normalized = normalizeCompany(companyData, userId, orgId);
    const company = await handleCompanyCreate(normalized);
    offerData.company = company._id;
  }

  const contactId = await createOrFindContact({
    ...contactData,
    companyId: offerData.company,
    userId,
    orgId,
  });
  if (contactId) offerData.contact = contactId;

  if (orgId) {
    const orgRes = await axios.get(`${AUTH_BASE}/api/org/me`, {
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
        "cookie": req.headers.cookie || "",
        "authorization": req.headers.authorization || "",
      },
    });
    const offerDefaults = orgRes.data?.record?.offerDefaults?.length
      ? orgRes.data.record.offerDefaults
      : offerDefaultsSeed;

    const incoming = versionData.offerTerms;
    versionData.offerTerms = Array.isArray(incoming) && incoming.length
      ? incoming
      : offerDefaults;
  }

  const record = await createSimpleOffer({ ...offerData, ...versionData });
  return res.status(statusCode).json({ message: successMessage, record, success: true });
}

module.exports = {
  create: async (req, res) => {
    try {
      return await handleOfferFlow(req, res, 201, "Basit teklif oluşturuldu.");
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },

  update: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id).select("offerType").exec();
      if (!offer) return res.status(404).json({ message: "Teklif bulunamadı.", success: false });
      if (offer.offerType !== "simple")
        return res.status(400).json({ message: "Bu işlem yalnızca basit teklifler için geçerlidir.", success: false });

      req.body._id = req.params.id;
      return await handleOfferFlow(req, res, 200, "Basit teklif güncellendi.");
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },
};
