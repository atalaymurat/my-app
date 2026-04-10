const Offer = require("../models/offer/Offer");
const axios = require("axios");
const logger = require("../config/logger");
const axiosRetry = require("axios-retry").default;
const authAxios = axios.create({ timeout: 15000 });

// PDF service için ayrı axios instance
const pdfAxios = axios.create({
  timeout: 35000,
});

axiosRetry(authAxios, {
  retries: 2,
  retryDelay: (retryCount) => retryCount * 2000,
  retryCondition: (error) =>
    error.code === "ECONNABORTED" || axiosRetry.isNetworkError(error),
});

axiosRetry(pdfAxios, {
  retries: 2,
  retryDelay: (retryCount) => retryCount * 3000,
  retryCondition: (error) =>
    error.code === "ECONNABORTED" || axiosRetry.isNetworkError(error),
  onRetry: (retryCount) => {
    logger.info({ message: "pdf-service retry", attempt: retryCount });
  },
});

module.exports = {
  offerPdf: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id)
        .populate("company")
        .populate("contact")
        .exec();

      if (!offer)
        return res
          .status(404)
          .json({ message: "Teklif bulunamadı.", success: false });

      // Organizasyon logosunu ve banka hesaplarını auth-service'ten çek
      let logoUrl = null;
      let bankAccounts = [];
      try {
        const token = req.cookies?.accessToken;
        if (token && process.env.AUTH_SERVICE_URL) {
          const orgRes = await authAxios.get(`${process.env.AUTH_SERVICE_URL}/api/org/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-internal-api-key": process.env.INTERNAL_API_KEY,
            },
          });
          logoUrl = orgRes.data?.logo || null;
          bankAccounts = orgRes.data?.bankAccounts || [];
        }
      } catch {
        // org verisi alınamazsa devam et
      }

      const pdfResponse = await pdfAxios.post(
        `${process.env.PDF_SERVICE_URL}/generate`,
        {
          template: "quotation",
          data: { ...offer.toObject({ flattenMaps: true }), logoUrl, bankAccounts },
        },
        {
          responseType: "arraybuffer",
          headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY },
        },
      );

      const lastVersion = offer.versions[offer.versions.length - 1];

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="offer-${lastVersion.docCode}.pdf"`,
      });

      res.send(pdfResponse.data);
    } catch (err) {
      logger.error({ message: "offerPdf error", error: err.message });
      res.status(500).json({ message: err.message, success: false });
    }
  },
};
