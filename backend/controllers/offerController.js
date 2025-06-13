const createOffer = require("./utils/offer/createOffer");
const {
  normalizeCompanyData,
  handleCompanyCreateOrUpdate,
  linkCompany,
  updateUserCompanyLink,
} = require("./services/companyServices");

const normalizeOfferData = require("./utils/offer/normalizeOfferData");
const Offer = require ("../models/offer/Offer");

module.exports = {
  create: async (req, res) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Yetkisiz erişim.", success: false });
      }

      const rawData = req.body;

      // Veriyi normalize et
      const { offerData, versionData, needsCompanyCreation, companyData } =
        normalizeOfferData(rawData, userId);

      // Eğer companyId yoksa, şirketi oluştur
      if (needsCompanyCreation && companyData) {
        const normalized = normalizeCompanyData(companyData);
        const company = await handleCompanyCreateOrUpdate(
          normalized,
          companyData,
        );
        console.log("Şirket oluşturuldu veya güncellendi:", company);
        await linkCompany(userId, company, normalized);
        await updateUserCompanyLink(userId, company, normalized);
        offerData.company = company._id;
      }

      // user bilgisini ekle
      offerData.user = userId;

      // Teklif kaydını oluştur
      const record = await createOffer({ ...offerData, ...versionData});
      return res.status(201).json({
        message: "Teklif oluşturuldu.",
        record,
        success: true,
      });
    } catch (error) {
      console.error("Teklif oluşturma hatası:", error);
      return res.status(500).json({
        message: "Teklif oluşturulurken bir hata oluştu.",
        error: error.message,
        success: false,
      });
    }
  },

  index: async (req, res) => {

    const records = await Offer.find({})
      .populate("company")
      .sort({ createdAt: -1 })
      .exec();
    return res
      .status(200)
      .json({ message: "Teklif kayıtları", success: true, records });
  },
};
