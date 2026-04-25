require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("../../models/contact/userContact");
const { normalizeText } = require("../../controllers/utils/contact/normalizeData");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const contacts = await Contact.find({
      $or: [
        { normalizedName: { $exists: false } },
        { normalizedName: "" },
        { normalizedName: null },
      ],
    });

    console.log(`Found ${contacts.length} contacts to update`);

    for (const contact of contacts) {
      contact.normalizedName = normalizeText(contact.name);
      await contact.save();

      console.log(`Updated: ${contact.name} -> ${contact.normalizedName}`);
    }

    console.log("Backfill completed");
    process.exit(0);
  } catch (err) {
    console.error("Backfill failed:", err);
    process.exit(1);
  }
}

run();