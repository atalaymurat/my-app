const normalizeData = require("./utils/masterProduct/normalizeData");
const createMasterProduct = require("./utils/masterProduct/createMasterProduct");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const createProductVariant = require("./utils/productVariant/createProductVariant");

module.exports = {
  index: async (req, res) => {
    try {
      const rawLimit = req.query.limit;
      const limit =
        rawLimit && (rawLimit === "all" || Number(rawLimit) === 0)
          ? 0 // ← no limit, return every record
          : parseInt(rawLimit, 10) || 10; // default: 10 per page

      const page = parseInt(req.query.page, 10) || 1;
      const skip = limit === 0 ? 0 : (page - 1) * limit;

      const filter = { user: req.user._id };

      const totalRecords = await MasterProduct.countDocuments(filter);
      let query = MasterProduct.find(filter).sort({ createdAt: -1 });
      if (limit !== 0) query = query.skip(skip).limit(limit); // pagination only if needed
      const records = await query.exec();

      return res.status(200).json({
        message: "Base products List.",
        success: true,
        totalPages: limit === 0 ? 1 : Math.ceil(totalRecords / limit),
        currentPage: limit === 0 ? 1 : page,
        products: records,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  create: async (req, res) => {
    try {
      if (!req.user?._id || !req.body) {
        return res.status(401).json({
          message: "No user or No data",
          success: false,
        });
      }

      const data = req.body;
      const userId = req.user._id;

      const normalized = normalizeData(data, userId);

      const newMasterProduct = await createMasterProduct(normalized);

      let newProductVariant = null;
      // asItIs true ise varyant oluştur
      if (normalized.productVariant === "asItIs") {
        const variantData = {
          ...normalized,
          masterProduct: newMasterProduct._id,
          createdFromMaster: true,
        };

        newProductVariant = await createProductVariant(variantData, userId);
      }

      return res.status(200).json({
        message: "Product created successfully.",
        product: newMasterProduct,
        variant: newProductVariant,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  list: async (req, res) => {
    try {
      const make = req.query.make;
      const query = { user: req.user._id, condition: "new" };

      if (make) {
        query.nMake = make;
      }

      const records = await MasterProduct.find(query);

      const list = records.map((record) => ({
        value: record._id,
        condition: record.condition,
        make: record.make,
        label: record.title,
        year: record.year,
        model: record.model,  
        productVariant: record.productVariant,
        priceNet: record.priceNet?.value,
        listPrice: record.priceList?.value,
        currency: record.priceList?.currency,
        desc: record.description,
      }));

      res.status(200).json({
        message: make
          ? `Base product list filtered by make '${make}' retrieved successfully.`
          : "Base product list retrieved successfully.",
        success: true,
        list,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  makeList: async (req, res) => {
    try {
      const records = await MasterProduct.find({
        user: req.user._id,
        condition: "new",
      });
      const list = [...new Set(records.map((record) => record.make))];
      const makes = list.map((make) => ({
        value: make,
        label: make,
      }));

      res.status(200).json({
        message: "Master product makes retrieved successfully.",
        success: true,
        makes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
