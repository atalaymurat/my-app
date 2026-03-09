const normalizeData = require("./utils/masterProduct/normalizeData");
const createMasterProduct = require("./utils/masterProduct/createMasterProduct");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const Option = require("../models/options/Option");

module.exports = {
  index: async (req, res) => {
    try {
      const rawLimit = req.query.limit;
      const limit =
        rawLimit && (rawLimit === "all" || Number(rawLimit) === 0)
          ? 0
          : parseInt(rawLimit, 10) || 10; // default: 10 per page

      const page = parseInt(req.query.page, 10) || 1;
      const skip = limit === 0 ? 0 : (page - 1) * limit;

      const filter = { user: req.user._id };

      const totalRecords = await MasterProduct.countDocuments(filter);
      let query = MasterProduct.find(filter)
      .populate("options", "title")
      .populate("make", "name")
      .sort({ createdAt: -1 });
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

      return res.status(200).json({
        message: "Product created successfully.",
        product: newMasterProduct,
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

  optionsByMaster: async (req, res) => {
    try {
      const { id } = req.params;

      // 1️⃣ Güvenlik: Master gerçekten bu user’a mı ait?
      const master = await MasterProduct.findOne({
        _id: id,
        user: req.user._id,
      }).lean();

      if (!master) {
        return res.status(404).json({
          success: false,
          message: "Master product not found",
        });
      }

      // 2️⃣ Bu master’a bağlı optionları çek
      const options = await Option.find({
        user: req.user._id,
        masterProducts: id,
      })
        .select("title description priceNet priceList")
        .lean();

      // 3️⃣ Response sadeleştir
      const formattedOptions = options.map((opt) => ({
        _id: opt._id,
        title: opt.title,
        description: opt.description,
        price: opt.priceList?.value || 0,
        currency: opt.priceList?.currency || master.priceList?.currency,
      }));

      res.status(200).json({
        success: true,
        master: {
          _id: master._id,
          title: master.title,
          basePrice: master.priceNet?.value || 0,
          currency: master.priceNet?.currency,
        },
        options: formattedOptions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  offerList: async (req, res, next) => {
    try {
      // Master Product Listesini Çek Ve Opsyonlarını ilave et
      const query = { user: req.user._id };
      const records = await MasterProduct.find(query);

      const list = records.map((record) => ({
        value: record._id,
        label: record.title,
        currency: record.currency,
        caption: record.caption,
      }));

      res.status(200).json({
        message: "List Of Masters With Options",
        success: true,
        list,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  masterByMake: async (req, res) => {
    try {
      const makeId = req.params.id;

      if (!makeId) {
        return res.status(400).json({
          success: false,
          message: "Make id is required",
        });
      }

      const masters = await MasterProduct.find({
        user: req.user._id,
        make: makeId,
      })
        .populate("make", "name") // sadece name getir
        .sort({ createdAt: -1 });

      console.log("Masters By Make Id", masters);
      return res.status(200).json({
        success: true,
        message: "Masters by make id",
        masters,
      });
    } catch (error) {
      console.error("masterByMake error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
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
