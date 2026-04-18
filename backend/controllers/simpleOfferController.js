const axios = require("axios");
const offerDefaultsSeed = require("../utils/offerDefaultsSeed");
const normalizeSimpleOffer = require("./utils/simpleOffer/normalizeSimpleOffer");
const createSimpleOffer = require("./utils/simpleOffer/createSimpleOffer");
const { normalizeCompanyData } = require("./services/companyServices");
const createNewCompany = require("./utils/company/createNewCompany");
const createOrFindContact = require("./utils/contact/createOrFindContact");

const AUTH_BASE = process.env.AUTH_SERVICE_URL;

module.exports = {
  create: async (req, res) => {
    try {
      const userId = req.user?._id;
      const orgId = req.user?.orgId || null;
      if (!userId) return res.status(401).json({ message: "Yetkisiz erişim.", success: false });

      const { offerData, versionData, needsCompanyCreation, companyData, contactData } =
        normalizeSimpleOffer(req.body, userId, orgId);

      if (needsCompanyCreation && companyData) {
        const normalized = normalizeCompanyData(companyData, userId, orgId);
        const company = await createNewCompany(normalized, companyData);
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
      return res.status(201).json({ message: "Basit teklif oluşturuldu.", record, success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },
};
