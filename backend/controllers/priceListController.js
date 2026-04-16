const PriceList = require("../models/priceList/PriceList");
const PriceListSnapshot = require("../models/priceList/PriceListSnapshot");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const Make = require("../models/Make");
const buildSnapshotItems = require("./utils/priceList/buildSnapshotItems");

function calculateSummary(items = []) {
  return {
    totalProducts: items.length,
    totalVariants: items.reduce((sum, item) => sum + (item.variants?.length || 0), 0),
    totalOptions: items.reduce((sum, item) => sum + (item.options?.length || 0), 0),
  };
}


module.exports = {
  create: async (req, res) => {
    try {
      const { title, makeId, currency, description, assignedOrgs = [] } = req.body;

      if (!title || !makeId || !currency) {
        return res.status(400).json({ success: false, message: "title, makeId ve currency zorunludur." });
      }

      const make = await Make.findById(makeId);
      if (!make) {
        return res.status(404).json({ success: false, message: "Marka bulunamadı." });
      }

      const record = await PriceList.create({
        title: title.trim(),
        nTitle: title.trim().toLowerCase(),
        make: makeId,
        currency,
        description: description || "",
        assignedOrgs,
        status: "draft",
        createdBy: req.user._id,
      });

      return res.status(201).json({ success: true, record });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const filter = {};

      if (req.query.status) filter.status = req.query.status;
      if (req.query.makeId) filter.make = req.query.makeId;

      const total = await PriceList.countDocuments(filter);
      const records = await PriceList.find(filter)
        .populate("make", "name logo country")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        records,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  show: async (req, res) => {
    try {
      const record = await PriceList.findById(req.params.id).populate("make", "name logo country");

      if (!record) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      return res.status(200).json({ success: true, record });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const allowed = ["title", "description", "currency", "status"];
      const updateData = {};

      for (const key of allowed) {
        if (req.body[key] !== undefined) updateData[key] = req.body[key];
      }

      if (updateData.title) {
        updateData.title = updateData.title.trim();
        updateData.nTitle = updateData.title.toLowerCase();
      }

      const updatedRecord = await PriceList.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedRecord) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      return res.status(200).json({ success: true, record: updatedRecord });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      await PriceListSnapshot.deleteMany({ priceList: req.params.id });
      const record = await PriceList.findByIdAndDelete(req.params.id);

      if (!record) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      return res.status(200).json({ success: true, message: "Fiyat listesi ve tüm versiyonları silindi." });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  archive: async (req, res) => {
    try {
      const priceList = await PriceList.findById(req.params.id);
      if (!priceList) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      priceList.status = "archived";
      await PriceListSnapshot.updateMany({ priceList: req.params.id, status: "published" }, { status: "superseded" });
      await priceList.save();

      return res.status(200).json({ success: true, record: priceList });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  createSnapshot: async (req, res) => {
    try {
      const priceList = await PriceList.findById(req.params.id);
      if (!priceList) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      const products = await MasterProduct.find({ make: priceList.make }).populate("options");

      if (!products.length) {
        return res.status(400).json({ success: false, message: "Bu markaya ait ürün bulunamadı." });
      }

      const items = buildSnapshotItems(products, priceList.currency);
      const version = priceList.totalVersions + 1;
      const summary = calculateSummary(items);

      const record = await PriceListSnapshot.create({
        priceList: priceList._id,
        version,
        status: "draft",
        notes: req.body.notes || "",
        items,
        summary,
        createdBy: req.user._id,
      });

      priceList.totalVersions = version;
      await priceList.save();

      return res.status(200).json({ success: true, record });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  cloneSnapshot: async (req, res) => {
    try {
      const priceList = await PriceList.findById(req.params.id);
      if (!priceList) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      const publishedSnapshot = await PriceListSnapshot.findOne({
        priceList: req.params.id,
        status: "published",
      });

      if (!publishedSnapshot) {
        return res.status(404).json({ success: false, message: "Yayında snapshot bulunamadı." });
      }

      const publishedData = publishedSnapshot.toObject();
      const version = priceList.totalVersions + 1;
      const record = await PriceListSnapshot.create({
        priceList: priceList._id,
        version,
        status: "draft",
        notes: req.body.notes || "",
        items: publishedData.items || [],
        summary: publishedData.summary || {},
        createdBy: req.user._id,
      });

      priceList.totalVersions = version;
      await priceList.save();

      return res.status(200).json({ success: true, record });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateSnapshotItems: async (req, res) => {
    try {
      const snapshot = await PriceListSnapshot.findOne({
        _id: req.params.snapshotId,
        priceList: req.params.id,
      });

      if (!snapshot) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      if (snapshot.status !== "draft") {
        return res.status(400).json({ success: false, message: "Sadece taslak snapshot düzenlenebilir." });
      }

      const payloadItems = Array.isArray(req.body.items) ? req.body.items : [];

      payloadItems.forEach((bodyItem) => {
        const targetItem = snapshot.items.find((item) => String(item.sourceMasterProduct) === String(bodyItem.sourceMasterProduct));
        if (!targetItem) return;

        if (bodyItem.sortOrder !== undefined) {
          targetItem.sortOrder = bodyItem.sortOrder;
        }

        (bodyItem.variants || []).forEach((bodyVariant) => {
          const targetVariant = targetItem.variants.find(
            (variant) => String(variant.sourceVariantId) === String(bodyVariant.sourceVariantId)
          );

          if (!targetVariant) return;

          if (bodyVariant.priceList !== undefined) targetVariant.priceList = bodyVariant.priceList;
          if (bodyVariant.priceOffer !== undefined) targetVariant.priceOffer = bodyVariant.priceOffer;
          if (bodyVariant.priceNet !== undefined) targetVariant.priceNet = bodyVariant.priceNet;
        });

        (bodyItem.options || []).forEach((bodyOption) => {
          const targetOption = targetItem.options.find((option) => String(option.sourceOption) === String(bodyOption.sourceOption));
          if (!targetOption) return;

          if (bodyOption.priceList !== undefined) targetOption.priceList = bodyOption.priceList;
          if (bodyOption.priceOffer !== undefined) targetOption.priceOffer = bodyOption.priceOffer;
          if (bodyOption.priceNet !== undefined) targetOption.priceNet = bodyOption.priceNet;
        });
      });

      snapshot.summary = calculateSummary(snapshot.items);
      snapshot.markModified("items");
      snapshot.markModified("summary");
      await snapshot.save();

      return res.status(200).json({ success: true, record: snapshot });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  publishSnapshot: async (req, res) => {
    try {
      const snapshot = await PriceListSnapshot.findOne({
        _id: req.params.snapshotId,
        priceList: req.params.id,
      });

      if (!snapshot) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      if (snapshot.status !== "draft") {
        return res.status(400).json({ success: false, message: "Sadece taslak snapshot yayınlanabilir." });
      }

      await PriceListSnapshot.updateMany({ priceList: req.params.id, status: "published" }, { status: "superseded" });

      snapshot.status = "published";
      snapshot.publishedAt = new Date();
      await snapshot.save();

      await PriceList.findByIdAndUpdate(req.params.id, { currentVersion: snapshot.version, status: "published" });

      return res.status(200).json({ success: true, record: snapshot });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  listSnapshots: async (req, res) => {
    try {
      const records = await PriceListSnapshot.find({ priceList: req.params.id }).select("-items").sort({ version: -1 });
      return res.status(200).json({ success: true, records });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getSnapshot: async (req, res) => {
    try {
      const record = await PriceListSnapshot.findOne({
        _id: req.params.snapshotId,
        priceList: req.params.id,
      });

      if (!record) {
        return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
      }

      return res.status(200).json({ success: true, record });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getPublishedSnapshot: async (req, res) => {
    try {
      const record = await PriceListSnapshot.findOne({
        priceList: req.params.id,
        status: "published",
      });

      if (!record) {
        return res.status(404).json({ success: false, message: "Yayında snapshot bulunamadı." });
      }

      return res.status(200).json({ success: true, record });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  setAssignments: async (req, res) => {
    try {
      const { orgIds } = req.body;
      if (!Array.isArray(orgIds)) {
        return res.status(400).json({ error: "orgIds bir dizi olmalı." });
      }

      const priceList = await PriceList.findByIdAndUpdate(
        req.params.id,
        { assignedOrgs: orgIds },
        { new: true }
      );

      if (!priceList) {
        return res.status(404).json({ error: "Fiyat listesi bulunamadı." });
      }

      return res.status(200).json({ success: true, record: priceList });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },

  getAssignedPriceLists: async (req, res) => {
    try {
      const records = await PriceList.find({
        status: "published",
        assignedOrgs: req.user.orgId,
      })
        .populate("make", "name logo")
        .select("-assignedOrgs")
        .sort({ updatedAt: -1 });

      return res.status(200).json({ success: true, records });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getAssignedSnapshot: async (req, res) => {
    try {
      const priceList = await PriceList.findOne({
        _id: req.params.id,
        status: "published",
        assignedOrgs: req.user.orgId,
      }).populate("make", "name logo");

      if (!priceList) {
        return res.status(403).json({ success: false, message: "Bu listeye erişim yetkiniz yok." });
      }

      const snapshot = await PriceListSnapshot.findOne({
        priceList: req.params.id,
        status: "published",
      });

      if (!snapshot) {
        return res.status(404).json({ success: false, message: "Yayında snapshot bulunamadı." });
      }

      const list = snapshot.items.map((item) => ({
        value: String(item.sourceMasterProduct),
        label: item.title,
        caption: item.caption || "",
        image: item.image || "",
        desc: item.desc || "",
        currency: item.currency || priceList.currency,
        makeId: String(priceList.make._id),
        makeName: priceList.make.name,
        variants: item.variants.map((v) => ({
          _id: v.sourceVariantId,
          modelType: v.modelType,
          code: v.code,
          priceList: v.priceList,
          priceOffer: v.priceOffer,
          priceNet: v.priceNet,
          desc: v.desc,
          image: v.image,
          stock: v.stock,
          technicalSpecs: v.technicalSpecs,
          isDefault: v.isDefault,
        })),
        options: item.options.map((opt) => ({
          value: String(opt.sourceOption),
          label: opt.title,
          image: opt.image || "",
          desc: opt.description || "",
          listPrice: opt.priceList || 0,
          offerPrice: opt.priceOffer || 0,
          netPrice: opt.priceNet || 0,
          currency: opt.currency || item.currency || priceList.currency,
        })),
      }));

      return res.status(200).json({
        success: true,
        list,
        priceListId: priceList._id,
        snapshotVersion: snapshot.version,
        makeName: priceList.make.name,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
