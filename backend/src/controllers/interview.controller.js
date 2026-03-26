const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

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

module.exports = {
  generateInterviewReportController,
};
