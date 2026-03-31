const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const {
  generateInterviewReport
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {

  console.log("REQ FILE:", req.file);
  console.log("REQ BODY:", req.body);


  try {
    if (!req.file) return res.status(400).json({ message: "Resume file is required" });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const { selfDescription, jobDescription, title } = req.body;
    if (!selfDescription || !jobDescription || !title)
      return res.status(400).json({ message: "All fields are required" });

    const interviewReportByAI = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    if (!interviewReportByAI) return res.status(500).json({ message: "AI failed to generate report" });

    const interviewReport = await interviewReportModel.create({
      user: req.userId,
      resume: resumeText,
      selfDescription,
      jobDescription,
      title,
      ...interviewReportByAI,
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("CONTROLLER ERROR:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.userId });
    if (!interviewReport) return res.status(404).json({ message: "Interview report not found" });
    return res.status(200).json({ message: "Interview report fetched successfully", interviewReport });
  } catch (error) {
    console.error("GET BY ID ERROR:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function getAllInterviewController(req, res) {
  try {
    const reports = await interviewReportModel
      .find({ user: req.userId })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v");
    return res.status(200).json(reports);
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewController,
};