

import axios from "axios";

//Create API instance
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// GENERATE REPORT (FILE UPLOAD)
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  try {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interview/", formData);

    return response.data;

  } catch (error) {
    console.error(
      "API ERROR (generateInterviewReport):",
      error.response?.data || error.message
    );

    throw error;
  }
};

// GET SINGLE REPORT
export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;

  } catch (error) {
    console.error(
      "API ERROR (getInterviewReportById):",
      error.response?.data || error.message
    );

    throw error;
  }
};

// GET ALL REPORTS
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview/");
    return response.data;

  } catch (error) {
    console.error(
      "API ERROR (getAllInterviewReports):",
      error.response?.data || error.message
    );

    throw error;
  }
};
