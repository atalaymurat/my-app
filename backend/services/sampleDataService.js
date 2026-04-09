const Make = require("../models/Make");
const Company = require("../models/company/Company");
const Contact = require("../models/contact/userContact");
const MasterProduct = require("../models/masterProduct/MasterProduct");
const Option = require("../models/options/Option");
const Offer = require("../models/offer/Offer");

const createSampleData = async (organizationId, userId) => {
  const make = await Make.create({
    name: "Örnek Makine",
    nName: "ornek makine",
    country: "Türkiye",
    description: "Örnek marka açıklaması",
    isActive: true,
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  const company = await Company.create({
    title: "Örnek Mobilya A.Ş.",
    normalizedTitle: "ornek mobilya as",
    vatTitle: "ÖRNEK MOBİLYA ANONİM ŞİRKETİ",
    phones: ["+90 212 555 0000"],
    emails: ["info@ornek-mobilya.com"],
    domains: ["ornek-mobilya.com"],
    vd: "Kadıköy",
    vatNo: `SMPL-${organizationId.toString().slice(-10)}`,
    addresses: [{
      title: "Merkez",
      line1: "Örnek Mahallesi, Demo Caddesi No:1",
      city: "İstanbul",
      country: "Türkiye",
      zip: "34000",
    }],
    tags: ["örnek", "mobilya"],
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  const contact = await Contact.create({
    name: "Ahmet Yılmaz",
    gender: "male",
    phones: ["+90 532 555 0000"],
    emails: ["ahmet@ornek-mobilya.com"],
    company: company._id,
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  const option1 = await Option.create({
    title: "Vakum Tabla Sistemi",
    nTitle: "vakum tabla sistemi",
    description: "Otomatik vakum tabla, güçlü tutma kapasitesi",
    priceNet: 30000,
    priceList: 40000,
    priceOffer: 35000,
    currency: "EUR",
    make: make._id,
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  const option2 = await Option.create({
    title: "Toz Emme Ünitesi",
    nTitle: "toz emme unitesi",
    description: "Endüstriyel toz emme sistemi",
    priceNet: 15000,
    priceList: 20000,
    priceOffer: 18000,
    currency: "EUR",
    make: make._id,
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  const masterProduct = await MasterProduct.create({
    title: "CNC Router Makinesi",
    nTitle: "cnc router makinesi",
    caption: "3 Eksenli Ahşap İşleme",
    nCaption: "3 eksenli ahsap isleme",
    desc: "Yüksek hassasiyetli 3 eksenli CNC router, ahşap ve kompozit malzeme işleme için ideal.",
    model: "CNC-3000",
    nModel: "cnc-3000",
    currency: "EUR",
    make: make._id,
    variants: [
      {
        modelType: "CNC-3000 Basic",
        code: "CNC-3000-B",
        priceNet: 45000,
        priceList: 55000,
        priceOffer: 50000,
        desc: "Temel konfigürasyon",
        stock: 5,
        isDefault: true,
        technicalSpecs: [
          { key: "Çalışma Alanı", value: "2000x3000mm" },
          { key: "Z Ekseni", value: "200mm" },
          { key: "Spindle Gücü", value: "5.5kW" },
        ],
      },
      {
        modelType: "CNC-3000 Pro",
        code: "CNC-3000-P",
        priceNet: 65000,
        priceList: 80000,
        priceOffer: 72000,
        desc: "Profesyonel konfigürasyon, ATC dahil",
        stock: 2,
        isDefault: false,
        technicalSpecs: [
          { key: "Çalışma Alanı", value: "2000x3000mm" },
          { key: "Z Ekseni", value: "300mm" },
          { key: "Spindle Gücü", value: "9kW" },
          { key: "ATC", value: "8 pozisyon" },
        ],
      },
    ],
    options: [option1._id, option2._id],
    visibilityScope: "group",
    organization: organizationId,
    createdBy: userId,
    isSample: true,
  });

  const offer = await Offer.create({
    company: company._id,
    contact: contact._id,
    organization: organizationId,
    createdBy: userId,
    versions: [{
      version: 1,
      docCode: "TKL-ÖRNEK-001",
      docType: "Teklif",
      docDate: new Date(),
      validDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lineItems: [{
        productValue: masterProduct._id.toString(),
        variantId: masterProduct.variants[0]._id.toString(),
        title: masterProduct.title,
        caption: masterProduct.caption,
        productDesc: masterProduct.desc,
        variantDesc: masterProduct.variants[0].desc,
        priceList: masterProduct.variants[0].priceList,
        priceOffer: masterProduct.variants[0].priceOffer,
        priceNet: masterProduct.variants[0].priceNet,
        currency: masterProduct.currency,
        quantity: 1,
        selectedOptions: [{
          optionId: option1._id.toString(),
          title: option1.title,
          label: option1.title,
          quantity: 1,
          listPrice: option1.priceList,
          offerPrice: option1.priceOffer,
          netPrice: option1.priceNet,
          currency: option1.currency,
          desc: option1.description,
        }],
        priceListTotal: { value: 95000, currency: "EUR" },
        priceOfferTotal: { value: 85000, currency: "EUR" },
        priceNetTotal: { value: 80000, currency: "EUR" },
      }],
      offerTerms: [
        { key: "delivery", label: "Teslimat Süresi", fieldType: "text", value: "6-8 Hafta", isEditable: true, isVisible: true },
        { key: "payment", label: "Ödeme Koşulları", fieldType: "text", value: "%50 Sipariş, %50 Teslimatta", isEditable: true, isVisible: true },
        { key: "warranty", label: "Garanti", fieldType: "text", value: "2 Yıl", isEditable: true, isVisible: true },
      ],
      totalsByCurrency: {
        EUR: { priceListTotal: 95000, priceOfferTotal: 85000, priceNetTotal: 80000, priceVat: 16000, priceGrandTotal: 96000 },
      },
      vatRate: 0.20,
      showTotals: true,
      showVat: true,
    }],
    isSample: true,
  });

  return { make, company, contact, options: [option1, option2], masterProduct, offer };
};

const deleteSampleData = async (organizationId) => {
  await Promise.all([
    Make.deleteMany({ organization: organizationId, isSample: true }),
    Company.deleteMany({ organization: organizationId, isSample: true }),
    Contact.deleteMany({ organization: organizationId, isSample: true }),
    Option.deleteMany({ organization: organizationId, isSample: true }),
    MasterProduct.deleteMany({ organization: organizationId, isSample: true }),
    Offer.deleteMany({ organization: organizationId, isSample: true }),
  ]);
};

module.exports = { createSampleData, deleteSampleData };
