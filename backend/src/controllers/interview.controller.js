const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const { application } = require("express");

/**
 * @description Generate interview report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Interview report
 */
const generateInterviewReportController = async (req, res) => {
  const resumeFile = req.file;
  console.log(resumeFile);

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(resumeFile.buffer),
  ).getText();
  // const resumeContent = await pdfParse(resumeFile.buffer);
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });
    
 
  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(200).json({
    success: true,
    message: "Interview report generated successfully",
    data: interviewReport,
  });
};

/**
 * @description Get interview report by interview ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Interview report
 */
const getInterviewReportByInterviewId = async (req, res) => {
  const { interviewId } = req.params;
  
  if(!interviewId){
    return res.status(400).json({
      success: false,
      message: "Interview ID is required",
    });
  }

  const interviewReport = await interviewReportModel.findOne({ _id : interviewId, user: req.user.id});

  if(!interviewReport){
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
    
}


/**
 * @description Get all interview reports
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Interview reports
 */

const getAllInterviewReports = async (req, res) => {
   const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * @description Generate resume PDF based on self description, resume, job description
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateResumePdfController = async (req, res) => {
  const { interviewReportId } = req.params;
  
  if(!interviewReportId){
    return res.status(400).json({
      success: false,
      message: "Interview report ID is required",
    });
  }

  const interviewReport = await interviewReportModel.findOne({ _id : interviewReportId, user: req.user.id});

  if(!interviewReport){
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
    "Content-Disposition": "attachment; filename=resume.pdf"
  })
  console.log("Resume PDF => ", resumePdf);
  
  res.send(resumePdf);
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByInterviewId,
  getAllInterviewReports,
  generateResumePdfController  
};
