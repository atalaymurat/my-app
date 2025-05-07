module.exports = function applyContactStatics(schema) {
  schema.statics.findOrCreate = async function (conditions, createData) {
    const normalizedConditions = {};
    let searchCriteria = [];

    // Normalize email conditions
    if (conditions.emails && conditions.emails.length > 0) {
      normalizedConditions["emails.address"] = {
        $in: conditions.emails.map((email) =>
          typeof email === "string"
            ? email.toLowerCase().trim()
            : email.address.toLowerCase().trim()
        ),
      };
      searchCriteria.push(
        ...normalizedConditions["emails.address"].$in.map((email) => ({
          "emails.address": email,
        }))
      );
    }

    // Normalize phone conditions
    if (conditions.phones && conditions.phones.length > 0) {
      normalizedConditions["phones.number"] = {
        $in: conditions.phones.map((phone) =>
          typeof phone === "string"
            ? phone.replace(/[\s()-]/g, "")
            : phone.number.replace(/[\s()-]/g, "")
        ),
      };
      searchCriteria.push(
        ...normalizedConditions["phones.number"].$in.map((phone) => ({
          "phones.number": phone,
        }))
      );
    }

    // Only search if we have specific criteria
    let existingContact = null;
    if (searchCriteria.length > 0) {
      existingContact = await this.findOne({
        $or: searchCriteria,
      });
    }

    if (existingContact) {
      return {
        success: false,
        contact: existingContact,
        message: "Contact already exists",
        exists: true,
      };
    }

    try {
      const newContact = new this({ ...conditions, ...createData });
      await newContact.validate();
      const savedContact = await newContact.save();

      return {
        success: true,
        contact: savedContact,
        message: "Contact created successfully",
        exists: false,
      };
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error - contact was created by another operation
        const duplicateContact = await this.findOne({
          $or: searchCriteria,
        });

        if (duplicateContact) {
          return {
            success: true,
            contact: duplicateContact,
            message: "Contact was created by another operation",
            exists: true,
          };
        }

        return {
          success: false,
          contact: null,
          message: "Duplicate contact detected but not found",
          exists: false,
          error: error,
        };
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return {
          success: false,
          contact: null,
          message: `Validation failed: ${messages.join(", ")}`,
          exists: false,
          error: error,
        };
      }

      // Other unexpected errors
      return {
        success: false,
        contact: null,
        message: "Failed to create contact",
        exists: false,
        error: error,
      };
    }
  };
};
