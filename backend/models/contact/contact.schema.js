const { Schema } = require("mongoose");

const contactSchema = new Schema(
  {
    gender: { type: String, enum: ["male", "female", "none"] },
    name: { type: String, required: true },
    emails: [String],
    phones: [String],
    image: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
toJSON: { virtuals: true },
  }
);

module.exports = contactSchema;
