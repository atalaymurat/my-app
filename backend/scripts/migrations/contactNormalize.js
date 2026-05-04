require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("../../models/contact/Contact");
const { normalizeText } = require("../../controllers/utils/normalize");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const contacts = await Contact.find({
      $or: [
        { normalizedName: { $exists: false } },
        { normalizedName: "" },
        { normalizedName: null },
        { source: { $exists: false } },
        { sourceType: { $exists: false } },
      ],
    });

    console.log(`Found ${contacts.length} contacts to update`);

    for (const contact of contacts) {
      const displayName = contact.displayName || "";

      contact.displayName = displayName;
      contact.normalizedName = normalizeText(displayName);
      contact.source = contact.source || "manual";
      contact.sourceType = contact.sourceType || "manual";
      await contact.save();

      console.log(`Updated: ${displayName} -> ${contact.normalizedName}`);
    }

    console.log("Backfill completed");
    process.exit(0);
  } catch (err) {
    console.error("Backfill failed:", err);
    process.exit(1);
  }
}

run();
