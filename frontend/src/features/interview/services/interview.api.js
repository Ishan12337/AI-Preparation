
import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// GENERATE REPORT
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
  setLoading, // pass loading state from frontend
}) => {
  try {
    setLoading?.(true);

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interview/", formData);
    return response.data;
  } catch (error) {
    console.error("API ERROR (generateInterviewReport):", error.response?.data || error.message);
    throw error;
  } finally {
    setLoading?.(false);
  }
};

// GET SINGLE REPORT
export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error("API ERROR (getInterviewReportById):", error.response?.data || error.message);
    throw error;
  }
};

// GET ALL REPORTS
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview/");
    return response.data;
  } catch (error) {
    console.error("API ERROR (getAllInterviewReports):", error.response?.data || error.message);
    throw error;
  }
};