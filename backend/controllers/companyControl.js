const normalizeCompanyData = require("./utils/company/normalizeCompanyData");
const {
  handleCompanyCreateOrUpdate,
  linkCompany,
  updateUserCompanyLink,
} = require("./services/companyServices");
const UserCompany = require("../models/company/UserCompany")

module.exports = {
  index: async (req, res ) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      console.log("CTRL INDEX")

      const filter = { user: req.user._id };

      const totalCompanies = await UserCompany.countDocuments(filter);
      const companies = await UserCompany.find(filter)
        .populate({ path: "company", select: "title favicon domains" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      console.log("Companies Controller Index User Comapnies", companies);

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

  create: async (req, res ) => {
    try {
      if (!req.user || !req.body) {
        return res
          .status(400)
          .json({ message: "No valid user or data found." });
      }

      const user = req.user;
      const rawData = req.body;
      const normalizedData = normalizeCompanyData(rawData);

      const company = await handleCompanyCreateOrUpdate(
        normalizedData,
        rawData
      );
      await linkCompany(user, company, normalizedData);
      await updateUserCompanyLink(user, company, normalizedData);

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
