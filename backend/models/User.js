// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: String,
    emailVerified: { type: Boolean, default: false },
    authProvider: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["user", "admin", "editor", "premium"],
      default: ["user"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      theme: { type: String, default: "light" },
      receiveNewsletter: { type: Boolean, default: false },
    },
    lastLoginAt: {
      // Can be updated using 'auth_time' or 'iat' from token
      type: Date,
    },
  },
  {
    // Schema Options
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create indexes manually after schema definition

// Add the findOrCreate static method
userSchema.statics.findOrCreate = async function (userData) {
  try {
    // Try to find existing user
    let user = await this.findOne({
      $or: [{ firebaseUid: userData.firebaseUid }, { email: userData.email }],
    });

    // If user doesn't exist, create new one
    if (!user) {
      user = await this.create({
        firebaseUid: userData.firebaseUid,
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture,
        emailVerified: userData.emailVerified || false,
        authProvider: userData.authProvider || "password",
      });
    }

    return user;
  } catch (error) {
    console.error("User.findOrCreate error:", error);
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
