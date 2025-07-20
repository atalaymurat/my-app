const Offer = require("../models/offer/Offer");
const axios = require("axios");

module.exports = {
  offerPdf: async (req, res) => {
    const id = req.params.id;
    const offer = await Offer.findById(id).populate("company").exec();
    if (!offer) {
      return res
        .status(404)
        .json({ message: "Teklif bulunamadı.", success: false });
    }
    const pdfResponse = await axios.post(
      `${process.env.PDF_SERVICE_URL}/generate`,
      offer,
      { responseType: "arraybuffer" },
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="offer-${id}.pdf"`,
    });
    res.send(pdfResponse.data);
  },
};
