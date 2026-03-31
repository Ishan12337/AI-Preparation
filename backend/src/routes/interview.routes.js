const express = require("express")
const protect = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()


/**
 * @route POST /api/interview
 * @desc generate new interview report on the basis of user self description
 * @access private
 */
interviewRouter.post("/", protect, upload.single("resume"), interviewController.generateInterviewReportController)



/**
 * @route get /api/interview/report/:interviewId
 * @desc get interview report
 * @access private
 */
interviewRouter.get("/report/:interviewId", protect,interviewController.getInterviewReportByIdController)



/**
 * @route get /api/interview/
 * @desc get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", protect , interviewController.getAllInterviewController)





module.exports = interviewRouter

