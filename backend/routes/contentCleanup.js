const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

const Contact = require("../models/contact/Contact");
const Company = require("../models/company/Company");
const Offer = require("../models/offer/Offer");
const PriceList = require("../models/priceList/PriceList");
const PriceListSnapshot = require("../models/priceList/PriceListSnapshot");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const Option = require("../models/options/Option");
const Make = require("../models/Make");

router.delete("/cleanup/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const token = req.headers["x-service-token"];
    if (!token || token !== process.env.INTERNAL_SERVICE_TOKEN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const results = {
      contacts: 0,
      companies: 0,
      offers: 0,
      priceLists: 0,
      priceListSnapshots: 0,
      masterProducts: 0,
      options: 0,
      makes: 0,
    };

    // Delete contacts
    const contactResult = await Contact.deleteMany({ createdBy: userId });
    results.contacts = contactResult.deletedCount;

    // Delete companies
    const companyResult = await Company.deleteMany({ createdBy: userId });
    results.companies = companyResult.deletedCount;

    // Delete offers
    const offerResult = await Offer.deleteMany({ createdBy: userId });
    results.offers = offerResult.deletedCount;

    // Delete price lists
    const priceListResult = await PriceList.deleteMany({ createdBy: userId });
    results.priceLists = priceListResult.deletedCount;

    // Delete price list snapshots
    const snapshotResult = await PriceListSnapshot.deleteMany({ createdBy: userId });
    results.priceListSnapshots = snapshotResult.deletedCount;

    // Delete master products
    const masterProductResult = await MasterProduct.deleteMany({ createdBy: userId });
    results.masterProducts = masterProductResult.deletedCount;

    // Delete options
    const optionResult = await Option.deleteMany({ createdBy: userId });
    results.options = optionResult.deletedCount;

    // Delete makes
    const makeResult = await Make.deleteMany({ createdBy: userId });
    results.makes = makeResult.deletedCount;

    logger.info({
      message: "User content cleanup completed",
      userId,
      results,
    });

    res.json({ success: true, results });
  } catch (error) {
    logger.error({
      message: "User content cleanup failed",
      userId,
      error: error.message,
    });
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
