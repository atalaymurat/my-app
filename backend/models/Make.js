const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const makeSchema = new Schema(
  {
    name: { type: String, required: true },
    nName: String, // normalized

    logo: String,
    country: String,
    description: String,

    isActive: { type: Boolean, default: true },
    isSample: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

makeSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Make", makeSchema);