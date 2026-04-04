const createOffer = require("./utils/offer/createOffer");
const { normalizeCompanyData, handleCompanyCreateOrUpdate } = require("./services/companyServices");
const Offer = require("../models/offer/Offer");
const normalizeOfferData = require("./utils/offer/normalizeOfferData");
const createNewCompany = require("./utils/company/createNewCompany");
const createOrFindContact = require("./utils/contact/createOrFindContact");

module.exports = {
  create: async (req, res) => {
    try {
      const userId = req.user?._id;
      const orgId = req.user?.orgId;
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

      const record = await createOffer({ ...offerData, ...versionData });
      return res.status(201).json({ message: "Teklif oluşturuldu.", record, success: true });
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
