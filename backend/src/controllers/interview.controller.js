// interview.controller.js
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  console.log("REQ FILE:", req.file);
  console.log("REQ BODY:", req.body);

  try {
    if (!req.file)
      return res.status(400).json({ message: "Resume file is required" });

    const { selfDescription, jobDescription, title } = req.body;
    if (!selfDescription || !jobDescription)
      return res.status(400).json({ message: "Self description & job description are required" });

    // Call AI service (it handles PDF parsing internally)
    const interviewReportByAI = await generateInterviewReport({
      resume: req.file,
      selfDescription,
      jobDescription,
    });

    if (!interviewReportByAI)
      return res.status(500).json({ message: "AI failed to generate report" });

    const interviewReport = await interviewReportModel.create({
      user: req.userId,
      resume: req.file.buffer.toString("base64"), // store as base64 if needed
      selfDescription,
      jobDescription,
      title: title || interviewReportByAI.title,
      ...interviewReportByAI,
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("CONTROLLER ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.userId,
    });
    if (!interviewReport)
      return res.status(404).json({ message: "Interview report not found" });

    return res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    });
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