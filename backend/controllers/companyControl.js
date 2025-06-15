const { normalizeCompanyData } = require("./services/companyServices");
const Company = require("../models/company/Company");
const createNewCompany = require("./utils/company/createNewCompany");

module.exports = {
  index: async (req, res) => {
    console.log("Company Index Req User ", req.user);
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = { user: req.user._id };

      const totalCompanies = await Company.countDocuments(filter);
      const companies = await Company.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        succuess: true,
        message: "User companies fetched successfully.",
        companies,
        totalPages: Math.ceil(totalCompanies / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  search: async (req, res) => {
    const search = req.query.search;

    if (!search) return res.status(400).json({ success: false });

    const normalized = search.trim()?.toLowerCase();
    const companies = await Company.find({
      title: { $regex: normalized, $options: "i" }, user: req.user._id,
    }).limit(5);
    console.log("Company Find", companies);

    if (!companies.length) {
      return res.json({ success: false, message: "Company not found" });
    }

    res.json({
      success: true,
      companies: companies.map((company) => ({
        id: company._id,
        title: company.title,
        vatTitle: company.vatTitle,
        domain: company.domains?.[0] || "",
        email: company.emails?.[0] || "",
        line1: company.addresses?.[0]?.line1 || "",
        line2: company.addresses?.[0]?.line2 || "",
        city: company.addresses?.[0]?.city || "",
        country: company.addresses?.[0]?.country || "",
        district: company.addresses?.[0]?.district || "",
      })),
    });
  },

  create: async (req, res) => {
    try {
      if (!req.user || !req.body) {
        return res
          .status(400)
          .json({ message: "No valid user or data found." });
      }

      const userId = req.user._id;
      const rawData = req.body;
      const normalizedData = normalizeCompanyData(rawData, userId);

      const record = await createNewCompany(normalizedData, rawData);

      return res.status(200).json({
        message: "Company creation success.",
        record,
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "An error occurred while creating the company.",
        error: err.message,
        success: false,
      });
    }
  },
};
