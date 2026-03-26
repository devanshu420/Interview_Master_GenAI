const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "Username already exists"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Account already exists with this Email"],
    lowercase: true,
    trim: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address",
    ],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian phone number",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  resetOtp: {
    type: Number,
    default: null,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
