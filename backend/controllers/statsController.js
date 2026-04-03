const Company = require("../models/company/Company");
const Contact = require("../models/contact/userContact");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const Option = require("../models/options/Option");
const Offer = require("../models/offer/Offer");

module.exports = {
  summary: async (req, res) => {
    try {
      const uid = req.user._id;

      const [companies, contacts, products, options, offers, offersByType] =
        await Promise.all([
          Company.countDocuments({ user: uid }),
          Contact.countDocuments({ user: uid }),
          MasterProduct.countDocuments({ user: uid }),
          Option.countDocuments({ user: uid }),
          Offer.countDocuments({ user: uid }),
          Offer.aggregate([
            { $match: { user: uid } },
            { $group: { _id: "$docType", count: { $sum: 1 } } },
          ]),
        ]);

      const byType = { Teklif: 0, Proforma: 0, Fatura: 0, Siparis: 0 };
      offersByType.forEach(({ _id, count }) => {
        if (_id in byType) byType[_id] = count;
      });

      res.status(200).json({
        success: true,
        stats: { companies, contacts, products, options, offers, offersByType: byType },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
