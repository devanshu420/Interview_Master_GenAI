// const axios = require("axios");
// const PDFParser = require("pdf2json");
// const { generateInterviewReport } = require("../services/ai.service");
// const interviewReportModel = require("../models/interviewReport.model");

// /**
//  * @description Parse PDF buffer to text using pdf2json
//  * @param {Buffer} buffer - PDF buffer
//  * @returns {Promise<string>} Extracted text
//  */
// const parsePdfFromBuffer = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const pdfParser = new PDFParser(null, 1); // 👈 second arg `1` = raw text mode

//     pdfParser.on("pdfParser_dataError", (err) => {
//       reject(new Error(err.parserError));
//     });

//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//       try {
//         // pdf2json v2+ uses pdfData.Pages, older uses pdfData.formImage.Pages
//         const pages = pdfData.Pages || pdfData.formImage?.Pages;

//         if (!pages || pages.length === 0) {
//           return reject(new Error("No pages found in PDF"));
//         }

//         const text = pages
//           .map((page) =>
//             (page.Texts || [])
//               .map((t) => {
//                 try {
//                   return decodeURIComponent(t.R?.[0]?.T || "");
//                 } catch {
//                   return t.R?.[0]?.T || "";
//                 }
//               })
//               .join(" ")
//           )
//           .join("\n");

//         resolve(text);
//       } catch (parseErr) {
//         console.error("Structure error:", parseErr.message);
//         console.error("pdfData keys:", Object.keys(pdfData));
//         reject(new Error("Failed to extract text from PDF structure"));
//       }
//     });

//     pdfParser.parseBuffer(buffer);
//   });
// };

// /**
//  * @description Generate interview report
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview report
//  */
// const generateInterviewReportController = async (req, res) => {
//   try {
//     const { resumeUrl, selfDescription, jobDescription, title } = req.body;
//     let resumeText = "";

//     if (resumeUrl) {
//       try {
//         const response = await axios.get(resumeUrl, {
//           responseType: "arraybuffer",
//           timeout: 15000,
//           headers: { Accept: "application/pdf" },
//         });

//         const buffer = Buffer.from(response.data);

//         console.log("Buffer length:", buffer.length);
//         console.log("First 5 bytes:", buffer.slice(0, 5).toString("ascii"));

//         if (buffer.slice(0, 5).toString("ascii") !== "%PDF-") {
//           return res.status(400).json({
//             success: false,
//             message: "The URL does not point to a valid PDF file.",
//           });
//         }

//         resumeText = await parsePdfFromBuffer(buffer);

//         if (!resumeText.trim()) {
//           console.warn("Parsed PDF returned empty text.");
//         }

//         console.log("Parsed resume text preview:", resumeText.slice(0, 200));
//       } catch (pdfError) {
//         console.error("PDF Parsing Error:", pdfError.message);
//         return res.status(400).json({
//           success: false,
//           message: `Failed to parse resume PDF: ${pdfError.message}`,
//         });
//       }
//     }

//     // Handle multipart upload (req.file from multer)
//     if (req.file) {
//       try {
//         resumeText = await parsePdfFromBuffer(req.file.buffer);
//         console.log("Parsed multipart resume text preview:", resumeText.slice(0, 200));
//       } catch (pdfError) {
//         console.error("Multipart PDF Parsing Error:", pdfError.message);
//         return res.status(400).json({
//           success: false,
//           message: `Failed to parse uploaded resume: ${pdfError.message}`,
//         });
//       }
//     }

//     if (!jobDescription || !selfDescription) {
//       return res.status(400).json({
//         success: false,
//         message: "jobDescription and selfDescription are required.",
//       });
//     }

//     const interviewReportByAi = await generateInterviewReport({
//       resume: resumeText,
//       selfDescription,
//       jobDescription,
//     });

//     const interviewReport = await interviewReportModel.create({
//       user: req.user.id,
//       resume: resumeText,
//       selfDescription,
//       jobDescription,
//       title,
//       ...interviewReportByAi,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Interview report generated successfully",
//       data: interviewReport,
//     });
//   } catch (error) {
//     console.error("Controller Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to generate report",
//     });
//   }
// };

// /**
//  * @description Get interview report by interview ID
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview report
//  */
// const getInterviewReportByInterviewId = async (req, res) => {
//   const { interviewId } = req.params;

//   if (!interviewId) {
//     return res.status(400).json({
//       success: false,
//       message: "Interview ID is required",
//     });
//   }

//   const interviewReport = await interviewReportModel.findOne({
//     _id: interviewId,
//     user: req.user.id,
//   });

//   if (!interviewReport) {
//     return res.status(404).json({
//       success: false,
//       message: "Interview report not found",
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Interview report fetched successfully",
//     data: interviewReport,
//   });
// };

// /**
//  * @description Get all interview reports
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview reports
//  */
// const getAllInterviewReports = async (req, res) => {
//   const interviewReports = await interviewReportModel
//     .find({ user: req.user.id })
//     .sort({ createdAt: -1 })
//     .select(
//       "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
//     );

//   res.status(200).json({
//     message: "Interview reports fetched successfully.",
//     interviewReports,
//   });
// };

// /**
//  * @description Generate resume PDF based on self description, resume, job description
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// const generateResumePdfController = async (req, res) => {
//   const { interviewReportId } = req.params;

//   if (!interviewReportId) {
//     return res.status(400).json({
//       success: false,
//       message: "Interview report ID is required",
//     });
//   }

//   const interviewReport = await interviewReportModel.findOne({
//     _id: interviewReportId,
//     user: req.user.id,
//   });

//   if (!interviewReport) {
//     return res.status(404).json({
//       success: false,
//       message: "Interview report not found",
//     });
//   }

//   const { resume, selfDescription, jobDescription } = interviewReport;

//   const resumePdf = await generateResumePdf({
//     resume,
//     selfDescription,
//     jobDescription,
//   });

//   res.set({
//     "Content-Type": "application/pdf",
//     "Content-Disposition": "attachment; filename=resume.pdf",
//   });

//   console.log("Resume PDF => ", resumePdf);
//   res.send(resumePdf);
// };

// module.exports = {
//   generateInterviewReportController,
//   getInterviewReportByInterviewId,
//   getAllInterviewReports,
//   generateResumePdfController,
// };





























// const pdfParse = require("pdf-parse");
// const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
// const interviewReportModel = require("../models/interviewReport.model");


// /**
//  * @description Generate interview report
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview report
//  */



// const generateInterviewReportController = async (req, res) => {
//   try {
//     // ✅ Step 1: Check if file was uploaded
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({
//         success: false,
//         message: "Resume PDF is required",
//       });
//     }

//     // ✅ Step 2: Extract text from PDF buffer (works in production — no disk needed)
//     let resumeText;
//     try {
//       const parsed = await pdfParse(req.file.buffer);
//       resumeText = parsed.text?.trim();
//     } catch (pdfError) {
//       console.error("PDF parse error:", pdfError.message);
//       return res.status(422).json({
//         success: false,
//         message: "Failed to extract text from PDF. Please upload a valid, text-based PDF.",
//       });
//     }

//     // ✅ Step 3: Validate extracted text
//     if (!resumeText || resumeText.length < 50) {
//       return res.status(422).json({
//         success: false,
//         message: "PDF appears to be empty or image-based (scanned). Please upload a text-based PDF.",
//       });
//     }

//     const { selfDescription, jobDescription } = req.body;

//     if (!selfDescription || !jobDescription) {
//       return res.status(400).json({
//         success: false,
//         message: "selfDescription and jobDescription are required",
//       });
//     }

//     // ✅ Step 4: Generate AI report
//     const interviewReportByAi = await generateInterviewReport({
//       resume: resumeText,
//       selfDescription,
//       jobDescription,
//     });

//     // ✅ Step 5: Save to DB
//     const interviewReport = await interviewReportModel.create({
//       user: req.user.id,
//       resume: resumeText,
//       selfDescription,
//       jobDescription,
//       ...interviewReportByAi,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Interview report generated successfully",
//       data: interviewReport,
//     });

//   } catch (err) {
//     console.error("generateInterviewReportController error:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };
// // const generateInterviewReportController = async (req, res) => {
// //   console.log("Req.body : ", req.body);
  
// //   const resumeFile = req.file;
// //   console.log(" resume file : ",resumeFile);
// //   console.log("Resume file buffer : ", resumeFile.buffer);
  
// //   const resumeContent = await new pdfParse.PDFParse(
// //     Uint8Array.from(resumeFile.buffer),
// //   ).getText();
// //   // const resumeContent = await pdfParse(resumeFile.buffer);
// //   const { selfDescription, jobDescription } = req.body;

// //   const interviewReportByAi = await generateInterviewReport({
// //     resume: resumeContent.text,
// //     selfDescription,
// //     jobDescription,
// //   });
    
 
// //   const interviewReport = await interviewReportModel.create({
// //     user: req.user.id,
// //     resume: resumeContent.text,
// //     selfDescription,
// //     jobDescription,
// //     ...interviewReportByAi,
// //   });

// //   res.status(200).json({
// //     success: true,
// //     message: "Interview report generated successfully",
// //     data: interviewReport,
// //   });
// // };

// /**
//  * @description Get interview report by interview ID
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview report
//  */
// const getInterviewReportByInterviewId = async (req, res) => {
//   const { interviewId } = req.params;
  
//   if(!interviewId){
//     return res.status(400).json({
//       success: false,
//       message: "Interview ID is required",
//     });
//   }

//   const interviewReport = await interviewReportModel.findOne({ _id : interviewId, user: req.user.id});

//   if(!interviewReport){
//     return res.status(404).json({
//       success: false,
//       message: "Interview report not found",
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Interview report fetched successfully",
//     data: interviewReport,
//   });
    
// }


// /**
//  * @description Get all interview reports
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview reports
//  */

// const getAllInterviewReports = async (req, res) => {
//    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

//     res.status(200).json({
//         message: "Interview reports fetched successfully.",
//         interviewReports
//     })
// }

// /**
//  * @description Generate resume PDF based on self description, resume, job description
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// const generateResumePdfController = async (req, res) => {
//   const { interviewReportId } = req.params;
  
//   if(!interviewReportId){
//     return res.status(400).json({
//       success: false,
//       message: "Interview report ID is required",
//     });
//   }

//   const interviewReport = await interviewReportModel.findOne({ _id : interviewReportId, user: req.user.id});

//   if(!interviewReport){
//     return res.status(404).json({
//       success: false,
//       message: "Interview report not found",
//     });
//   }
//   const { resume, selfDescription, jobDescription } = interviewReport;
//   const resumePdf = await generateResumePdf({
//     resume,
//     selfDescription,
//     jobDescription,
//   });

//   res.set({
//     "Content-Type": "application/pdf",
//     "Content-Disposition": "attachment; filename=resume.pdf"
//   })
//   console.log("Resume PDF => ", resumePdf);
  
//   res.send(resumePdf);
// }

// module.exports = {
//   generateInterviewReportController,
//   getInterviewReportByInterviewId,
//   getAllInterviewReports,
//   generateResumePdfController
// };










// const pdfParse = require("pdf-parse");
// const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
// const interviewReportModel = require("../models/interviewReport.model");

// /**
//  * @description Generate interview report
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview report
//  */
// const generateInterviewReportController = async (req, res) => {
//   try {
//     // ✅ Step 1: Check if file was uploaded
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({
//         success: false,
//         message: "Resume PDF is required",
//       });
//     }

//     // ✅ Step 2: Extract text from PDF buffer
//     let resumeText;
//     try {
//       const parsed = await pdfParse(req.file.buffer);
//       resumeText = parsed.text?.trim();
//     } catch (pdfError) {
//       console.error("PDF parse error:", pdfError.message);
//       return res.status(422).json({
//         success: false,
//         message: "Failed to extract text from PDF. Please upload a valid, text-based PDF.",
//       });
//     }

//     // ✅ Step 3: Validate extracted text
//     if (!resumeText || resumeText.length < 50) {
//       return res.status(422).json({
//         success: false,
//         message: "PDF appears to be empty or image-based (scanned). Please upload a text-based PDF.",
//       });
//     }

//     // ✅ Step 4: Validate request body
//     const { selfDescription, jobDescription } = req.body;

//     if ( !jobDescription) {
//       return res.status(400).json({
//         success: false,
//         message: "jobDescription are required",
//       });
//     }

//     // ✅ Step 5: Generate AI report
//     const interviewReportByAi = await generateInterviewReport({
//       resume: resumeText,
//       selfDescription,
//       jobDescription,
//     });

//     // ✅ Step 6: Save to DB
//     const interviewReport = await interviewReportModel.create({
//       user: req.user.id,
//       resume: resumeText,
//       selfDescription,
//       jobDescription,
//       ...interviewReportByAi,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Interview report generated successfully",
//       data: interviewReport,
//     });

//   } catch (err) {
//     console.error("generateInterviewReportController error:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };

// /**
//  * @description Get interview report by interview ID
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview report
//  */
// const getInterviewReportByInterviewId = async (req, res) => {
//   try {
//     const { interviewId } = req.params;

//     if (!interviewId) {
//       return res.status(400).json({
//         success: false,
//         message: "Interview ID is required",
//       });
//     }

//     const interviewReport = await interviewReportModel.findOne({
//       _id: interviewId,
//       user: req.user.id,
//     });

//     if (!interviewReport) {
//       return res.status(404).json({
//         success: false,
//         message: "Interview report not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Interview report fetched successfully",
//       data: interviewReport,
//     });

//   } catch (err) {
//     console.error("getInterviewReportByInterviewId error:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };

// /**
//  * @description Get all interview reports
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Object} Interview reports
//  */
// const getAllInterviewReports = async (req, res) => {
//   try {
//     const interviewReports = await interviewReportModel
//       .find({ user: req.user.id })
//       .sort({ createdAt: -1 })
//       .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

//     return res.status(200).json({
//       success: true,
//       message: "Interview reports fetched successfully",
//       data: interviewReports,
//     });

//   } catch (err) {
//     console.error("getAllInterviewReports error:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };

// /**
//  * @description Generate resume PDF based on self description, resume, job description
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// const generateResumePdfController = async (req, res) => {
//   try {
//     const { interviewReportId } = req.params;

//     if (!interviewReportId) {
//       return res.status(400).json({
//         success: false,
//         message: "Interview report ID is required",
//       });
//     }

//     const interviewReport = await interviewReportModel.findOne({
//       _id: interviewReportId,
//       user: req.user.id,
//     });

//     if (!interviewReport) {
//       return res.status(404).json({
//         success: false,
//         message: "Interview report not found",
//       });
//     }

//     const { resume, selfDescription, jobDescription } = interviewReport;

//     const resumePdf = await generateResumePdf({
//       resume,
//       selfDescription,
//       jobDescription,
//     });

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=resume.pdf",
//     });

//     return res.send(resumePdf);

//   } catch (err) {
//     console.error("generateResumePdfController error:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };

// module.exports = {
//   generateInterviewReportController,
//   getInterviewReportByInterviewId,
//   getAllInterviewReports,
//   generateResumePdfController,
// };











const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
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

    //  Step 2: Extract text from PDF buffer
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

    // Step 3: Validate extracted text
    if (!resumeText || resumeText.length < 50) {
      return res.status(422).json({
        success: false,
        message: "PDF appears to be empty or image-based (scanned). Please upload a text-based PDF.",
      });
    }

    //  Step 4: Validate request body
    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "selfDescription and jobDescription are required",
      });
    }

    //  Step 5: Generate AI report
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    //  Step 6: Save to DB
    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
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

    //  Handle Gemini overload specifically
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

    //  Handle Gemini overload specifically
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