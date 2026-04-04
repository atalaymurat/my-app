const { normalizeMasterProduct: normalizeData } = require("../utils/normalize");
const createMasterProduct = require("./utils/masterProduct/createMasterProduct");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const Option = require("../models/options/Option");

module.exports = {
  show: async (req, res) => {
    try {
      const product = await MasterProduct.findOne({ _id: req.params.id, ...req.orgFilter }).populate("make", "name");
      if (!product) return res.status(404).json({ message: "Product not found", success: false });
      res.status(200).json({ success: true, product });
    } catch (err) {
      res.status(500).json({ message: "Failed to get product", error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const normalized = normalizeData(req.body, req.user._id, req.user.orgId);
      const product = await MasterProduct.findOneAndUpdate(
        { _id: req.params.id, ...req.orgFilter },
        { $set: normalized },
        { new: true, runValidators: true }
      );
      if (!product) return res.status(404).json({ message: "Product not found", success: false });
      res.status(200).json({ success: true, message: "Güncellendi", product });
    } catch (err) {
      res.status(500).json({ message: "Failed to update product", error: err.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const product = await MasterProduct.findOneAndDelete({ _id: req.params.id, ...req.orgFilter });
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.status(200).json({ success: true, message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete product", error: err.message });
    }
  },

  index: async (req, res) => {
    try {
      const rawLimit = req.query.limit;
      const limit = rawLimit && (rawLimit === "all" || Number(rawLimit) === 0)
        ? 0 : parseInt(rawLimit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const skip = limit === 0 ? 0 : (page - 1) * limit;

      const totalRecords = await MasterProduct.countDocuments(req.orgFilter);
      let query = MasterProduct.find(req.orgFilter).populate("make", "name").sort({ createdAt: -1 });
      if (limit !== 0) query = query.skip(skip).limit(limit);
      const records = await query.exec();

      return res.status(200).json({
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
      const normalized = normalizeData(req.body, req.user._id, req.user.orgId);
      const newMasterProduct = await createMasterProduct(normalized);
      return res.status(200).json({ success: true, product: newMasterProduct });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  list: async (req, res) => {
    try {
      const query = { ...req.orgFilter, condition: "new" };
      if (req.query.make) query.nMake = req.query.make;

      const records = await MasterProduct.find(query);
      const list = records.map((record) => ({
        value: record._id,
        condition: record.condition,
        make: record.make,
        label: record.title,
        year: record.year,
        model: record.model,
        desc: record.description,
      }));
      res.status(200).json({ success: true, list });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  optionsByMaster: async (req, res) => {
    try {
      const master = await MasterProduct.findOne({ _id: req.params.id, ...req.orgFilter }).lean();
      if (!master) return res.status(404).json({ success: false, message: "Master product not found" });

      const options = await Option.find({ ...req.orgFilter, masterProducts: req.params.id })
        .select("title description priceNet priceList").lean();

      const formattedOptions = options.map((opt) => ({
        _id: opt._id,
        title: opt.title,
        description: opt.description,
        price: opt.priceList?.value || 0,
        currency: opt.priceList?.currency || master.priceList?.currency,
      }));

      res.status(200).json({
        success: true,
        master: { _id: master._id, title: master.title },
        options: formattedOptions,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  offerList: async (req, res) => {
    try {
      const records = await MasterProduct.find(req.orgFilter).populate("make", "name");
      const list = records.map((record) => ({
        value: record._id,
        label: record.title,
        currency: record.currency,
        caption: record.caption,
        condition: record.condition,
        makeId: record.make?._id,
        makeName: record.make?.name,
        variants: record.variants || [],
      }));
      res.status(200).json({ success: true, list });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  masterByMake: async (req, res) => {
    try {
      if (!req.params.id) return res.status(400).json({ success: false, message: "Make id is required" });
      const masters = await MasterProduct.find({ ...req.orgFilter, make: req.params.id })
        .populate("make", "name").sort({ createdAt: -1 });
      return res.status(200).json({ success: true, masters });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  makeList: async (req, res) => {
    try {
      const records = await MasterProduct.find({ ...req.orgFilter, condition: "new" });
      const list = [...new Set(records.map((record) => record.make))];
      const makes = list.map((make) => ({ value: make, label: make }));
      res.status(200).json({ success: true, makes });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
