const express = require("express");

// Import middleware ********
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");

// Import controller ********
const {
  generateInterviewReportController,
} = require("../controllers/interview.controller");

// Create router
const router = express.Router();


/**
 * @route   POST /api/interview/generate-report
 * @desc    Generate interview report
 * @access  Private
 */
router.post(
  "/generate-report",
  authMiddleware,
  upload.single("resume"),
  generateInterviewReportController,
);

module.exports = router;
