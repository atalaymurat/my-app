require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const collections = ["makes", "options", "masterproducts", "pricelists", "pricelistsnapshots"];
    const results = {};

    for (const col of collections) {
      const before = await db.collection(col).countDocuments({ organization: { $exists: true } });
      await db.collection(col).updateMany({}, { $unset: { organization: "" } });
      const after = await db.collection(col).countDocuments({ organization: { $exists: true } });
      results[col] = { before, after };
    }

    console.log("📊 Cleanup results:");
    console.table(results);

    // Drop old compound indexes (Mongoose will rebuild correct ones on app restart)
    try {
      await db.collection("makes").dropIndex("name_1_organization_1");
      console.log("✅ Dropped makes.name_1_organization_1");
    } catch {}

    try {
      await db.collection("pricelists").dropIndex("organization_1_make_1_title_1");
      console.log("✅ Dropped pricelists.organization_1_make_1_title_1");
    } catch {}

    try {
      await db.collection("pricelists").dropIndex("organization_1_status_1");
      console.log("✅ Dropped pricelists.organization_1_status_1");
    } catch {}

    console.log("🎉 Cleanup complete. Restart backend to rebuild indexes.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
})();
