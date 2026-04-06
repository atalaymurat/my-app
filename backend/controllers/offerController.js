const axios = require("axios");
const offerDefaultsSeed = require("../utils/offerDefaultsSeed");
const createOffer = require("./utils/offer/createOffer");
const { normalizeCompanyData } = require("./services/companyServices");
const Offer = require("../models/offer/Offer");
const normalizeOfferData = require("./utils/offer/normalizeOfferData");
const createNewCompany = require("./utils/company/createNewCompany");
const createOrFindContact = require("./utils/contact/createOrFindContact");

const AUTH_BASE = process.env.AUTH_SERVICE_URL.replace(/\/api\/auth\/?$/, "");

module.exports = {
  create: async (req, res) => {
    try {
      const userId = req.user?._id;
      const orgId = req.user?.orgId || null;
      if (!userId) return res.status(401).json({ message: "Yetkisiz erişim.", success: false });

      const { offerData, versionData, needsCompanyCreation, companyData, contactData } =
        normalizeOfferData(req.body, userId, orgId);

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

      const record = await createOffer({ ...offerData, ...versionData });
      return res.status(201).json({ message: "Teklif oluşturuldu.", record, success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },

  update: async (req, res) => {
    try {
      const { offerTerms } = req.body;
      const record = await Offer.findOneAndUpdate(
        { _id: req.params.id, ...req.orgFilter },
        { offerTerms },
        { new: true, runValidators: true }
      );
      if (!record) return res.status(404).json({ message: "Teklif bulunamadı.", success: false });
      return res.status(200).json({ message: "Güncellendi.", record, success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },

  destroy: async (req, res) => {
    try {
      const record = await Offer.findOneAndDelete({ _id: req.params.id, ...req.orgFilter });
      if (!record) return res.status(404).json({ message: "Teklif bulunamadı.", success: false });
      return res.status(200).json({ message: "Teklif silindi.", success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },

  show: async (req, res) => {
    try {
      const record = await Offer.findOne({ _id: req.params.id, ...req.orgFilter })
        .populate("company")
        .populate("contact")
        .exec();
      if (!record) return res.status(404).json({ message: "Teklif bulunamadı.", success: false });
      return res.status(200).json({ success: true, record });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },

  index: async (req, res) => {
    try {
      const records = await Offer.find(req.orgFilter)
        .populate("company")
        .sort({ createdAt: -1 })
        .exec();
      return res.status(200).json({ success: true, records });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },
};
