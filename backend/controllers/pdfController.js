const Offer = require("../models/offer/Offer");
const axios = require("axios");

module.exports = {
  offerPdf: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id)
        .populate("company")
        .populate("contact")
        .exec();
      console.log("PDF OFFER", JSON.stringify(offer, null, 2))
      if (!offer) return res.status(404).json({ message: "Teklif bulunamadı.", success: false });

      const pdfResponse = await axios.post(
        `${process.env.PDF_SERVICE_URL}/generate`,
        { template: "quotation", data: offer },
        { responseType: "arraybuffer" },
      );

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="offer-${offer.docCode}.pdf"`,
      });
      res.send(pdfResponse.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "PDF üretilemedi.", success: false });
    }
  },
};
