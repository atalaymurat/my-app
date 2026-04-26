const axios = require("axios")
const offerDefaultsSeed = require("../utils/offerDefaultsSeed")
const createOffer = require("./utils/offer/createOffer")
const { normalizeCompany } = require("./utils/normalize")
const Offer = require("../models/offer/Offer")
const normalizeOfferData = require("./utils/offer/normalizeOfferData")
const createOrFindContact = require("./utils/contact/createOrFindContact")
const { handleCompanyCreate } = require("./services/companyServices")

const AUTH_BASE = process.env.AUTH_SERVICE_URL

module.exports = {
  create: async (req, res) => {
    try {
      const userId = req.user?._id
      const orgId = req.user?.orgId || null
      if (!userId)
        return res
          .status(401)
          .json({ message: "Yetkisiz erişim.", success: false })

      const {
        offerData,
        versionData,
        needsCompanyCreation,
        companyData,
        contactData,
      } = normalizeOfferData(req.body, userId, orgId)

      if (needsCompanyCreation && companyData) {
        const normalized = normalizeCompany(companyData, userId, orgId)
        const company = await handleCompanyCreate(normalized)
        offerData.company = company._id
      }

      const contactId = await createOrFindContact({
        ...contactData,
        companyId: offerData.company,
        userId,
        orgId,
      })

      if (contactId) offerData.contact = contactId

      if (orgId) {
        const orgRes = await axios.get(`${AUTH_BASE}/api/org/me`, {
          headers: {
            "x-internal-api-key": process.env.INTERNAL_API_KEY,
            cookie: req.headers.cookie || "",
            authorization: req.headers.authorization || "",
          },
        })
        const offerDefaults = orgRes.data?.offerDefaults?.length
          ? orgRes.data.offerDefaults
          : offerDefaultsSeed

        const incoming = versionData.offerTerms
        versionData.offerTerms =
          Array.isArray(incoming) && incoming.length ? incoming : offerDefaults
      }

      const record = await createOffer({ ...offerData, ...versionData })
      return res
        .status(201)
        .json({ message: "Teklif oluşturuldu.", record, success: true })
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false })
    }
  },

  update: async (req, res) => {
    try {
      const userId = req.user?._id
      const orgId = req.user?.orgId || null
      if (!userId)
        return res
          .status(401)
          .json({ message: "Yetkisiz erişim.", success: false })

      // _id route param'dan gelir, body'ye ekle ki normalizeOfferData edit modunu anlasın
      const payload = { ...req.body, _id: req.params.id }

      const {
        offerData,
        versionData,
        needsCompanyCreation,
        companyData,
        contactData,
      } = normalizeOfferData(payload, userId, orgId)

      if (needsCompanyCreation && companyData) {
        const normalized = normalizeCompany(companyData, userId, orgId)
        const company = await handleCompanyCreate(normalized)
        offerData.company = company._id
      }

      const contactId = await createOrFindContact({
        ...contactData,
        companyId: offerData.company,
        userId,
        orgId,
      })

      if (contactId) offerData.contact = contactId

      const record = await createOffer({ ...offerData, ...versionData })
      return res
        .status(200)
        .json({ message: "Teklif güncellendi.", record, success: true })
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false })
    }
  },

  destroy: async (req, res) => {
    try {
      const record = await Offer.findOneAndDelete({
        _id: req.params.id,
        ...req.orgFilter,
      })
      if (!record)
        return res
          .status(404)
          .json({ message: "Teklif bulunamadı.", success: false })
      return res.status(200).json({ message: "Teklif silindi.", success: true })
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false })
    }
  },

  show: async (req, res) => {
    try {
      const record = await Offer.findOne({
        _id: req.params.id,
        ...req.orgFilter,
      })
        .populate("company")
        .populate("contact")
        .exec()
      if (!record)
        return res
          .status(404)
          .json({ message: "Teklif bulunamadı.", success: false })
      return res.status(200).json({ success: true, record })
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false })
    }
  },

  index: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1)
      const limit = Math.min(50, parseInt(req.query.limit) || 10)
      const skip = (page - 1) * limit

      const filter = { ...req.orgFilter }
      if (req.query.status) filter.status = req.query.status

      const [records, total] = await Promise.all([
        Offer.find(filter)
          .populate("company")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Offer.countDocuments(filter),
      ])

      return res.status(200).json({
        success: true,
        records,
        totalPages: Math.ceil(total / limit),
        total,
        page,
      })
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false })
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body
      const allowed = ["open", "won", "lost", "cancelled"]
      if (!allowed.includes(status))
        return res
          .status(400)
          .json({ message: "Geçersiz status.", success: false })

      const update = { status }
      if (status === "won" || status === "lost" || status === "cancelled")
        update.closedAt = new Date()
      if (status === "open") update.closedAt = null

      const record = await Offer.findOneAndUpdate(
        { _id: req.params.id, ...req.orgFilter },
        { $set: update },
        { new: true },
      ).select("status closedAt")

      if (!record)
        return res
          .status(404)
          .json({ message: "Teklif bulunamadı.", success: false })
      return res.status(200).json({ success: true, record })
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false })
    }
  },
}
