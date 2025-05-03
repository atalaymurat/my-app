const Company = require("../models/Company");
const translit = require("transliteration");

module.exports = {
  index: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalCompanies = await Company.countDocuments();
      const companies = await Company.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        message:"success",
        companies,
        totalPages: Math.ceil(totalCompanies / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res, next) => {
    try {
      const data = req.body;
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "No Valid User Found" });
      }
      // Normalize web URL before processing
      if (data.web) {
        data.web = data.web
          .replace(/^https?:\/\//i, '')  // Remove http:// or https://
          .replace(/\/+$/, '')           // Remove trailing slashes
          .split('/')[0];                // Get only domain (remove paths)
      }

      const normalizedData = normalizeFields(data);
      const normalizedDataWithUser = { ...normalizedData, owner: user._id };
      const company = await Company.findOrCreate(normalizedDataWithUser);
      res.status(200).json({ message: "success", company });
    } catch (err) {
      console.error(err);
    }
  },
};

const normalizeFields = (data) => {
  const normalizedData = { ...data };

  // Normalize the main fields
  const fields = ["title", "vatTitle"];
  fields.forEach((field) => {
    const normalizedValue = data[field]
      ? translit.transliterate(data[field]).toLowerCase()
      : "";
    normalizedData[
      `normalized${field.charAt(0).toUpperCase()}${field.slice(1)}`
    ] = normalizedValue;
  });

  // Normalize the sub-fields
  const subFields = {
    addresses: ["line1", "line2", "district", "city", "country"],
  };
  for (const field in subFields) {
    if (data[field]) {
      const normalizedSubFields = data[field].map((subField) => {
        const normalizedSubField = {};
        for (const subFieldKey of subFields[field]) {
          const normalizedValue = subField[subFieldKey]
            ? translit.transliterate(subField[subFieldKey]).toLowerCase()
            : "";
          normalizedSubField[
            `normalized${subFieldKey
              .charAt(0)
              .toUpperCase()}${subFieldKey.slice(1)}`
          ] = normalizedValue;
        }
        return {
          ...subField,
          ...normalizedSubField,
        };
      });
      normalizedData[field] = normalizedSubFields;
    }
  }
  console.log("normalizedData", normalizedData);

  return normalizedData;
};
