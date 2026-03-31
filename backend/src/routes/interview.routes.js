const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const interviewController = require("../controllers/interview.controller");

router.post("/", protect, upload.single("resume"), interviewController.generateInterviewReportController);
router.get("/report/:interviewId", protect, interviewController.getInterviewReportByIdController);
router.get("/", protect, interviewController.getAllInterviewController);

module.exports = router;