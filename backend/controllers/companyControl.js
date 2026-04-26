const Company = require("../models/company/Company");
const {
  normalizeCompany,
  normalizeText,
} = require("./utils/normalize");

const {
   handleCompanyCreate,
} = require("./services/companyServices");

module.exports = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalCompanies = await Company.countDocuments(req.orgFilter);

      const companies = await Company.find(req.orgFilter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        companies,
        totalPages: Math.ceil(totalCompanies / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  search: async (req, res) => {
    try {
      const { search = "" } = req.query;

      if (search.trim().length < 2) {
        return res.json({ success: true, companies: [] });
      }

      const normalized = normalizeText(search);

      const companies = await Company.find({
        ...req.orgFilter,
        normalizedTitle: { $regex: normalized, $options: "i" },
      })
        .limit(5)
        .select(
          "title vatTitle domains emails addresses normalizedTitle normalizedVatTitle"
        );

      return res.json({
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
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Company search failed",
        error: err.message,
      });
    }
  },

  show: async (req, res) => {
    try {
      const company = await Company.findOne({
        _id: req.params.id,
        ...req.orgFilter,
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      res.status(200).json({ success: true, company });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch company",
        error: err.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const normalizedData = normalizeCompany(
        req.body,
        req.user._id,
        req.user.orgId
      );

      const company = await Company.findOneAndUpdate(
        { _id: req.params.id, ...req.orgFilter },
        normalizedData,
        { new: true, runValidators: true }
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      res.status(200).json({ success: true, company });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "Failed to update company",
        error: err.message,
      });
    }
  },

  destroy: async (req, res) => {
    try {
      const company = await Company.findOneAndDelete({
        _id: req.params.id,
        ...req.orgFilter,
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Company deleted",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to delete company",
        error: err.message,
      });
    }
  },

  create: async (req, res) => {
    if (!req.user.orgId) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için bir organizasyona bağlı olmanız gerekiyor.",
      });
    }

    try {
      const normalizedData = normalizeCompany(
        req.body,
        req.user._id,
        req.user.orgId
      );

      const record = await handleCompanyCreate(
        normalizedData,
        req.body
      );

      return res.status(200).json({
        success: true,
        record,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};