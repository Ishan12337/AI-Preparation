// interview.routes.js
const express = require("express");
const router = express.Router();

const { 
  generateInterviewReportController, 
  getInterviewReportByIdController, 
  getAllInterviewController 
} = require("../controllers/interview.controller");

const protect = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware"); // multer

// ---------------------- ROUTES ----------------------

// Generate Interview Report (with resume upload)
router.post(
  "/",
  protect, 
  upload.single("resume"), // must match FormData key from frontend
  generateInterviewReportController
);

// Get a single interview report by ID
router.get("/report/:interviewId", protect, getInterviewReportByIdController);

// Get all interview reports for logged-in user
router.get("/", protect, getAllInterviewController);

module.exports = router;