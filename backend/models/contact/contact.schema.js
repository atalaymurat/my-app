const { Schema } = require("mongoose");

const contactSchema = new Schema(
  {
    gender: { type: String, enum: ["male", "female", "none"] },
    name: { type: String, required: true },
    emails: [
      {
        address: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
          match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Geçersiz email formatı"],
        },
        isPrimary: Boolean,
      },
    ],
    phones: [
      {
        type: {
          type: String,
          enum: ["mobile", "business", "home", "other"],
          default: "mobile",
        },
        number: {
          type: String,
          validate: {
            validator: (v) => /^[\d\s+()-]{7,20}$/.test(v),
            message: "Geçersiz telefon numarası",
          },
        },
        isPrimary: Boolean,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

module.exports = contactSchema;
