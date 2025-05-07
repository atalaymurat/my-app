const Contact = require("../models/contact/contact.model");

module.exports = {
  index: async (req, res) => {
    // response all contact records
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = { owner: req.user._id };

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
    const user = req.user;
    // create contact via method findOrCreate on model
    try {
      const data = req.body;
      const dataWithUser = { ...data, owner: user._id };
      // data remove empty fields in array
      if (dataWithUser.phones) {
        dataWithUser.phones = dataWithUser.phones.filter(
          (phone) => phone.number !== ""
        );
      }
      if (dataWithUser.emails) {
        dataWithUser.emails = dataWithUser.emails.filter(
          (email) => email.address !== ""
        );
      }
      console.log("CONTACTS DATA ::", dataWithUser);

      const response = await Contact.findOrCreate(dataWithUser, {});

      console.log("CONTACTS CONTRL FIND OR CREATE RESPONSE ::", response);
      if (!response.success) {
        return res
          .status(400)
          .json({ message: response.message, success: false });
      }
      if (response.success) {
        return res.status(200).json({
          message: response.message,
          contact: response.contact,
          success: true,
        });
      }
    } catch (err) {
      console.error("CONTACTS CONTRL ERROR", err);
      res
        .status(400)
        .json({ message: "Failed to create contact", error: err.message });
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
