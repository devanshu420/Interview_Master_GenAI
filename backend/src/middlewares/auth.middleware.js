const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

// Middleware to authenticate user **************************************
const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not Provided",
    });
  }

  const isTokenBlacklisted = await blacklistModel.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "Token is invalid[b], Please login again.",
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Data : ", decoded);

    // Set Decoded data in req.user
    req.user = decoded

    next();

  } catch (error) {
    return res.status(401).json({
        message : "Invalid Token"
    })
  }
};


module.exports = authMiddleware;

