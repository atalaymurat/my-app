/**
 * Migration: fix-make-name-index
 * Drops the global unique index on Make.name and creates
 * a compound unique index on { name, organization } instead.
 * Usage:
 *   node scripts/migrations/fix-make-name-index.js           # run
 *   node scripts/migrations/fix-make-name-index.js --dry-run # preview
 */
require("dotenv").config();
const mongoose = require("mongoose");

const DRY_RUN = process.argv.includes("--dry-run");

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
  console.log("Connected to MongoDB");

  const col = mongoose.connection.collection("makes");
  const indexes = await col.indexes();
  console.log("Mevcut indexler:", indexes.map((i) => i.name));

  const hasOldIndex = indexes.some((i) => i.name === "name_1");
  const hasNewIndex = indexes.some((i) => i.name === "name_1_organization_1");

  if (DRY_RUN) {
    console.log("DRY RUN — değişiklik yapılmayacak");
    console.log("name_1 var mı:", hasOldIndex);
    console.log("name_1_organization_1 var mı:", hasNewIndex);
    await mongoose.disconnect();
    return;
  }

  if (hasOldIndex) {
    await col.dropIndex("name_1");
    console.log("name_1 unique index silindi");
  } else {
    console.log("name_1 index zaten yok, atlandı");
  }

  if (!hasNewIndex) {
    await col.createIndex({ name: 1, organization: 1 }, { unique: true });
    console.log("name_1_organization_1 compound unique index oluşturuldu");
  } else {
    console.log("name_1_organization_1 zaten var, atlandı");
  }

  await mongoose.disconnect();
  console.log("Migration tamamlandı");
};

run().catch((err) => {
  console.error("Migration hatası:", err);
  process.exit(1);
});
