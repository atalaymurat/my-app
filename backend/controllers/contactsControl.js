const Contact = require("../models/contact/userContact")
const {
  normalizeContact,
  normalizeText,
  normalizeContactUpdate,
} = require("./utils/normalize")

module.exports = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit

      const total = await Contact.countDocuments(req.orgFilter)
      const contacts = await Contact.find(req.orgFilter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })

      res.json({
        success: true,
        contacts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      })
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to retrieve contacts", error: err.message })
    }
  },

  find: async (req, res) => {
    try {
      function escapeRegex(text = "") {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      }
      const { search = "" } = req.query
      if (search.length < 2) return res.json({ success: true, contacts: [] })
      const normalized = normalizeText(search)
      const safe = escapeRegex(normalized)

      const contacts = await Contact.find({
        ...req.orgFilter,
        normalizedName: { $regex: safe, $options: "i" },
      })
        .sort({ normalizedName: 1 })
        .limit(10)
        .select("name phones emails")

      res.json({ success: true, contacts })
    } catch (err) {
      res.status(500).json({ message: "Search failed", error: err.message })
    }
  },

  show: async (req, res) => {
    try {
      const contact = await Contact.findOne({
        _id: req.params.id,
        ...req.orgFilter,
      })
      if (!contact)
        return res.status(404).json({ message: "Contact not found" })
      res.status(200).json({ success: true, contact })
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch contact", error: err.message })
    }
  },

  create: async (req, res) => {
    if (!req.user.orgId) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için bir organizasyona bağlı olmanız gerekiyor.",
      })
    }
    try {
      const contactData = normalizeContact(
        req.body,
        req.user._id,
        req.user.orgId,
      )
      const contact = await Contact.create(contactData)
      res.status(200).json({ success: true, contact, message: "Kaydedildi" })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to create contact",
        error: err.message,
      })
    }
  },

  update: async (req, res) => {
    try {
      const updateData = normalizeContactUpdate(req.body)

      const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id, ...req.orgFilter },
        updateData,
        { new: true },
      )
      if (!contact)
        return res.status(404).json({ message: "Contact not found" })
      res.status(200).json({ success: true, contact })
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to update contact", error: err.message })
    }
  },

  destroy: async (req, res) => {
    try {
      const contact = await Contact.findOneAndDelete({
        _id: req.params.id,
        ...req.orgFilter,
      })
      if (!contact)
        return res.status(404).json({ message: "Contact not found" })
      res.status(200).json({ success: true, message: "Contact deleted" })
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete contact", error: err.message })
    }
  },
}
