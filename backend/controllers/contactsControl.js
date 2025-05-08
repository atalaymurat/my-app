const { Contact } = require("../models/contact/contact.model");
const normalizeData = require("./utils/contacts/normalizeData")
const { handleContactCreateOrUpdate } = require("./services/contactServices")

module.exports = {
  index: async (req, res) => {
    // response all contact records
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = { createdBy: req.user._id };

      const totalContacts = await Contact.countDocuments(filter);
      const contacts = await Contact.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        message: "success",
        contacts,
        totalPages: Math.ceil(totalContacts / limit),
        currentPage: page,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to retrieve contacts", error: err.message });
    }
  },
  create: async (req, res) => {
    // create contact via method findOrCreate on model
    try {
      if (!req.user || !req.body) {
        return res
          .status(400)
          .json({ message: "No valid user or data found." });
      }
      const data = req.body;
      const user = req.user;
      // normalize data
      const normalized = normalizeData(data, user)
      console.log("Normalized Data", normalized)
      // check find if existing and update otherwise create new contact
      const contact = await handleContactCreateOrUpdate(normalized)
      console.log("Contact", contact)

      // Create userContact record if not exists, otherwise update it if there are changes



      return res.status(200).json({
        success: true,
        message: "Data proceed successfully",
      })


    } catch (err) {
      console.error("Error on ContactsControl.create", err);
      res
        .status(500)
        .json({ success: false,  message: "Failed to create contact", error: err.message });
    }
  },
  update: async (req, res) => {
    // find and update record
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      res.status(200).json(contact);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to update contact", error: err.message });
    }
  },
  destroy: async (req, res) => {
    // find and delete record
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);

      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      res
        .status(200)
        .json({ message: "Contact deleted successfully", contact });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete contact", error: err.message });
    }
  },
};
