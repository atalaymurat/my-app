function buildSnapshotItems(masterProducts, defaultCurrency) {
  return masterProducts.map((mp, index) => ({
    sourceMasterProduct: mp._id,
    title: mp.title,
    nTitle: mp.nTitle || mp.title?.toLowerCase() || "",
    caption: mp.caption || "",
    image: mp.image || "",
    desc: mp.desc || "",
    model: mp.model || "",
    currency: mp.currency || defaultCurrency,
    sortOrder: index,
    variants: (mp.variants || []).map((v) => ({
      sourceVariantId: String(v._id),
      modelType: v.modelType,
      code: v.code || "",
      priceNet: v.priceNet || 0,
      priceOffer: v.priceOffer || 0,
      priceList: v.priceList || 0,
      desc: v.desc || "",
      image: v.image || "",
      stock: v.stock || 0,
      technicalSpecs: v.technicalSpecs || [],
      isDefault: v.isDefault || false,
    })),
    options: (mp.options || []).map((opt) => ({
      sourceOption: opt._id,
      title: opt.title || "",
      nTitle: opt.nTitle || opt.title?.toLowerCase() || "",
      image: opt.image || "",
      description: opt.description || "",
      priceNet: opt.priceNet || 0,
      priceList: opt.priceList || 0,
      priceOffer: opt.priceOffer || 0,
      currency: mp.currency || defaultCurrency,
    })),
  }));
}
module.exports = buildSnapshotItems;
