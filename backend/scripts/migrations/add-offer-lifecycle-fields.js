/**
 * Migration: add-offer-lifecycle-fields
 * Adds currentDocType, originDocType, status fields to existing Offer documents.
 * Usage:
 *   node scripts/migrations/add-offer-lifecycle-fields.js           # run migration
 *   node scripts/migrations/add-offer-lifecycle-fields.js --dry-run # preview only
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Offer = require("../../models/offer/Offer");

const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 100;

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[Migration] Connected. dry-run=${DRY_RUN}`);

  const total = await Offer.countDocuments({
    $or: [{ currentDocType: { $exists: false } }, { originDocType: { $exists: false } }],
  });
  console.log(`[Migration] Offers to update: ${total}`);

  if (DRY_RUN || total === 0) {
    console.log("[Migration] Dry-run or nothing to do. Exiting.");
    await mongoose.disconnect();
    return;
  }

  let processed = 0;
  let cursor = Offer.find({
    $or: [{ currentDocType: { $exists: false } }, { originDocType: { $exists: false } }],
  })
    .select("versions currentDocType originDocType status")
    .lean()
    .cursor();

  const ops = [];

  for await (const doc of cursor) {
    const versions = doc.versions || [];
    const originDocType  = versions.length > 0 ? versions[0].docType : "Teklif";
    const currentDocType = versions.length > 0 ? versions[versions.length - 1].docType : "Teklif";

    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            currentDocType,
            originDocType,
            ...(doc.status === undefined && { status: "open" }),
          },
        },
      },
    });

    if (ops.length === BATCH_SIZE) {
      await Offer.bulkWrite(ops);
      processed += ops.length;
      ops.length = 0;
      console.log(`[Migration] Progress: ${processed}/${total}`);
    }
  }

  if (ops.length > 0) {
    await Offer.bulkWrite(ops);
    processed += ops.length;
    console.log(`[Migration] Progress: ${processed}/${total}`);
  }

  console.log(`[Migration] Done. Updated ${processed} documents.`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("[Migration] Error:", err);
  process.exit(1);
});
