const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
      type: String,
      required: [true, "Token is required"],
    },
  },
  { timestamps: true }
);

const TokenBlacklistModel = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

module.exports = TokenBlacklistModel;
