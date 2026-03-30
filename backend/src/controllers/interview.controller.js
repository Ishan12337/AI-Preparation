const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePDF} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");


/**
 * @desc Generate interview report using resume + self description + job description
 * @route POST /api/interview
 * @access Private
 */
async function generateInterviewReportController(req, res) {
  try {
   
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    
    const resumeContent = await (
      new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))
    ).getText();

    const { selfDescription, jobDescription } = req.body;

    
    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        message: "Self description and job description are required",
      });
    }

   
    const interviewReportByAI = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    
    if (!interviewReportByAI) {
      return res.status(500).json({
        message: "AI failed to generate report",
      });
    }

    
    const interviewReport = await interviewReportModel.create({
      user: req.user.userId, 
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAI,
    });

    
    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("CONTROLLER ERROR:", error.message);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * @desc Get single interview report by ID
 * @route GET /api/interview/report/:interviewId
 * @access Private
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.userId, 
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("GET BY ID ERROR:", error.message);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * @desc Get all interview reports of logged-in user
 * @route GET /api/interview
 * @access Private
 */


async function getAllInterviewController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.userId }) 
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v");

    return res.status(200).json(interviewReports);

  } catch (error) {
    console.error("GET ALL ERROR:", error.message);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}


module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewController,
  
};





