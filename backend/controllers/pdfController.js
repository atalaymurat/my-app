const Offer = require("../models/offer/Offer");
const axios = require("axios");

module.exports = {
  offerPdf: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id)
        .populate("company")
        .populate("contact")
        .exec();
      if (!offer) return res.status(404).json({ message: "Teklif bulunamadı.", success: false });

      // Organizasyon logosunu auth-service'ten çek
      let logoUrl = null;
      let bankAccounts = [];
      try {
        const token = req.cookies?.accessToken;
        if (token && process.env.AUTH_SERVICE_URL) {
          const authBase = process.env.AUTH_SERVICE_URL.replace(/\/api\/auth\/?$/, "");
          const orgRes = await axios.get(
            `${authBase}/api/org/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "x-internal-api-key": process.env.INTERNAL_API_KEY,
              },
            }
          );
          logoUrl = orgRes.data?.logo || null;
          bankAccounts = orgRes.data?.bankAccounts || [];
        }
      } catch {
        // org verisi alınamazsa devam et
      }

      const pdfResponse = await axios.post(
        `${process.env.PDF_SERVICE_URL}/generate`,
        { template: "quotation", data: { ...offer.toObject(), logoUrl, bankAccounts } },
        {
          responseType: "arraybuffer",
          headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY },
        },
      );
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="offer-${offer.versions[offer.versions.length - 1].docCode}.pdf"`,
      });
      res.send(pdfResponse.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err, success: false });
    }
  },
};
