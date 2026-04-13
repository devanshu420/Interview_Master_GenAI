
const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const { uploadResumeToImageKit } = require("../services/imagekit.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Generate interview report
 */
const generateInterviewReportController = async (req, res) => {
  try {
    //  Step 1: Check if file was uploaded
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    //  Step 2: Upload resume to ImageKit
    let resumeUrl, resumeFileId;
    try {
      const uploadResult = await uploadResumeToImageKit(
        req.file.buffer,
        `resume_${req.user.id}_${Date.now()}.pdf`
      );
      resumeUrl = uploadResult.url;
      resumeFileId = uploadResult.fileId;
      console.log(" Resume uploaded:", resumeUrl);
    } catch (uploadErr) {
      console.error("ImageKit upload error:", uploadErr.message);
      return res.status(500).json({
        success: false,
        message: "Failed to upload resume. Please try again.",
      });
    }

    //  Step 3: Extract text from PDF buffer
    let resumeText;
    try {
      const parsed = await pdfParse(req.file.buffer);
      resumeText = parsed.text?.trim();
    } catch (pdfError) {
      console.error("PDF parse error:", pdfError.message);
      return res.status(422).json({
        success: false,
        message: "Failed to extract text from PDF. Please upload a valid, text-based PDF.",
      });
    }

    //  Step 4: Validate extracted text
    if (!resumeText || resumeText.length < 50) {
      return res.status(422).json({
        success: false,
        message: "PDF appears to be empty or image-based. Please upload a text-based PDF.",
      });
    }

    //  Step 5: Validate request body
    const { selfDescription, jobDescription } = req.body;

    if ( !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "selfDescription and jobDescription are required",
      });
    }

    //  Step 6: Generate AI report using resumeUrl + jobDescription
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,       // text for AI processing
      resumeUrl,                // URL passed to AI context
      selfDescription,
      jobDescription,
    });

    //  Step 7: Save to DB with resumeUrl
    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      resumeUrl,                //  saved in DB
      resumeFileId,             //  saved in DB
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(200).json({
      success: true,
      message: "Interview report generated successfully",
      data: interviewReport,
    });

  } catch (err) {
    console.error("generateInterviewReportController error:", err.message);

    const isGeminiOverload =
      err.message?.includes("503") ||
      err.message?.includes("UNAVAILABLE") ||
      err.message?.includes("high demand");

    if (isGeminiOverload) {
      return res.status(503).json({
        success: false,
        message: "AI service is temporarily busy. Please try again in a few seconds.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * @description Get interview report by interview ID
 */
const getInterviewReportByInterviewId = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report fetched successfully",
      data: interviewReport,
    });

  } catch (err) {
    console.error("getInterviewReportByInterviewId error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * @description Get all interview reports
 */
const getAllInterviewReports = async (req, res) => {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      );

    return res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully",
      data: interviewReports,
    });

  } catch (err) {
    console.error("getAllInterviewReports error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * @description Generate resume PDF
 */
const generateResumePdfController = async (req, res) => {
  try {
    const { interviewReportId } = req.params;

    if (!interviewReportId) {
      return res.status(400).json({
        success: false,
        message: "Interview report ID is required",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const resumePdf = await generateResumePdf({
      resume,
      selfDescription,
      jobDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });

    return res.send(resumePdf);

  } catch (err) {
    console.error("generateResumePdfController error:", err.message);

    const isGeminiOverload =
      err.message?.includes("503") ||
      err.message?.includes("UNAVAILABLE") ||
      err.message?.includes("high demand");

    if (isGeminiOverload) {
      return res.status(503).json({
        success: false,
        message: "AI service is temporarily busy. Please try again in a few seconds.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  generateInterviewReportController,
  getInterviewReportByInterviewId,
  getAllInterviewReports,
  generateResumePdfController,
};