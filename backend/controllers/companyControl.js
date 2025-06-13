const normalizeCompanyData = require("./utils/company/normalizeCompanyData");
const {
  handleCompanyCreateOrUpdate,
  linkCompany,
  updateUserCompanyLink,
} = require("./services/companyServices");
const UserCompany = require("../models/company/UserCompany");

module.exports = {
  index: async (req, res) => {
    console.log("Company Index Req User ", req.user);
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = { user: req.user._id };

      const totalCompanies = await UserCompany.countDocuments(filter);
      const companies = await UserCompany.find(filter)
        .populate({ path: "company", select: "title favicon domains" })
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
    const companies = await UserCompany.find({
      customTitle: { $regex: normalized, $options: "i" },
    }).limit(5);
    console.log("Company Find", companies);

    if (!companies.length) {
      return res.json({ success: false, message: "Company not found" });
    }

    res.json({
      success: true,
      companies: companies.map((company) => ({
        id: company._id,
        title: company.customTitle,
        vatTitle: company.userVatTitle,
        domain: company.userDomains?.[0]|| "",
        email: company.userEmails?.[0] || "",
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
      const normalizedData = normalizeCompanyData(rawData);

      const company = await handleCompanyCreateOrUpdate(
        normalizedData,
        rawData,
      );
      await linkCompany(userId, company, normalizedData);
      await updateUserCompanyLink(userId, company, normalizedData);

      return res.status(200).json({
        message: "Company data process success.",
        company,
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
