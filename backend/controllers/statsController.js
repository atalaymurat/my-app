const mongoose = require("mongoose");
const Company = require("../models/company/Company");
const Contact = require("../models/contact/userContact");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const Option = require("../models/options/Option");
const Offer = require("../models/offer/Offer");
const Make = require("../models/Make");
const PriceList = require("../models/priceList/PriceList");

module.exports = {
  summary: async (req, res) => {
    try {
      // Superadmin sees all data, regular users see only their org data
      let filter = {};
      let aggregateFilter = {};

      if (!req.isSuperAdmin) {
        const orgId = req.user?.orgId || req.orgFilter?.organization;
        if (orgId) {
          // countDocuments coerces string → ObjectId automatically
          filter = { organization: orgId };
          // aggregate $match needs explicit ObjectId conversion
          aggregateFilter = { organization: new mongoose.Types.ObjectId(orgId) };
        }
      }

      const [companies, contacts, products, options, offers, makes, priceLists, offersByTypeResult] = await Promise.all([
        Company.countDocuments(filter),
        Contact.countDocuments(filter),
        MasterProduct.countDocuments(filter),
        Option.countDocuments(filter),
        Offer.countDocuments(filter),
        Make.countDocuments(filter),
        PriceList.countDocuments(filter),
        Offer.aggregate([
          { $match: aggregateFilter },
          { $group: { _id: "$currentDocType", count: { $sum: 1 } } },
        ]),
      ]);

      // Always initialize with zeros, then fill in actual counts
      const byType = { Teklif: 0, Proforma: 0, Sipariş: 0, Sözleşme: 0 };

      // Ensure offersByTypeResult is an array before iterating
      if (Array.isArray(offersByTypeResult)) {
        offersByTypeResult.forEach(({ _id, count }) => {
          if (_id in byType) byType[_id] = count;
        });
      }

      res.status(200).json({
        success: true,
        stats: { companies, contacts, products, options, offers, makes, priceLists, offersByType: byType },
      });
    } catch (err) {
      console.error("Stats API error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
