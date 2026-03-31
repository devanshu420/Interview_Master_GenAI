const express = require("express");

// Import middleware ********
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");

// Import controller ********
const {
  generateInterviewReportController,
  getInterviewReportByInterviewId,
  getAllInterviewReports,
  generateResumePdfController
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

/**
 * @route   GET /api/interview/getReport/:interviewId
 * @desc    Get interview report
 * @access  Private
 */
router.get(
  "/getReport/:interviewId",
  authMiddleware,
  getInterviewReportByInterviewId
  
);

/**
 * @route   GET /api/interview/getAllReports
 * @desc    Get all interview reports
 * @access  Private
 */
router.get(
  "/getAllReports",
  authMiddleware,
  getAllInterviewReports
);


/**
 * @route   POST /api/interview/generate-resume-pdf/:interviewReportId
 * @desc    Generate resume PDF
 * @access  Private
 */
router.post(
  "/generate-resume-pdf/:interviewReportId",
  authMiddleware,
  generateResumePdfController
);

module.exports = router;
