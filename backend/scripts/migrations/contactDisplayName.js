require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("../../models/contact/Contact");
const {
  buildContactDisplayName,
  normalizeText,
} = require("../../controllers/utils/normalize");

const isDryRun = process.argv.includes("--dry-run");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const contacts = await Contact.find({
      $or: [
        { displayName: { $exists: false } },
        { displayName: "" },
        { displayName: null },
        { givenName: { $exists: false } },
        { givenName: "" },
        { givenName: null },
        { middleName: { $exists: false } },
        { middleName: "" },
        { middleName: null },
        { familyName: { $exists: false } },
        { familyName: "" },
        { familyName: null },
        { normalizedName: { $exists: false } },
        { normalizedName: "" },
        { normalizedName: null },
      ],
    });

    console.log(`Found ${contacts.length} contacts to update`);
    if (isDryRun) {
      console.log("Dry run enabled. No records will be saved.");
    }

    for (const contact of contacts) {
      const nextGivenName = contact.givenName;
      const nextMiddleName = contact.middleName;
      const nextFamilyName = contact.familyName;

      const nextDisplayName =
        buildContactDisplayName({
          givenName: nextGivenName,
          middleName: nextMiddleName,
          familyName: nextFamilyName,
        }) || contact.displayName || "";
      const nextNormalizedName = normalizeText(nextDisplayName);

      contact.givenName = nextGivenName;
      contact.middleName = nextMiddleName;
      contact.familyName = nextFamilyName;
      contact.displayName = nextDisplayName;
      contact.normalizedName = nextNormalizedName;
      contact.source = contact.source || "manual";
      contact.sourceType = contact.sourceType || "manual";

      if (!isDryRun) {
        await contact.save();
      }

      console.log(
        `${isDryRun ? "Preview" : "Updated"}: ${contact.displayName || contact._id} -> given="${nextGivenName || ""}", middle="${nextMiddleName || ""}", family="${nextFamilyName || ""}", display="${nextDisplayName}", normalized="${nextNormalizedName}"`,
      );
    }

    console.log("Display name backfill completed");
    process.exit(0);
  } catch (err) {
    console.error("Display name backfill failed:", err);
    process.exit(1);
  }
}

run();
