
import {
  getInterviewReportById,
  getAllInterviewReports,
  generateInterviewReport
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../context/interview.context";
import { useAuth } from "../../auth/hooks/useAuth"

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within InterviewProvider");
  }


const { user, loading: authLoading } = useAuth();


  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
  } = context;

  // GET ALL REPORTS
  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
     
      setReports(Array.isArray(response) ? response : []);
      return response;
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]); 
      return [];
    } finally {
      setLoading(false);
    }
  };

  // GET SINGLE REPORT
  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      // Ensure response.interviewReport exists
      setReport(response?.interviewReport || {});
      return response?.interviewReport || {};
    } catch (err) {
      console.error("Error fetching report:", err);
      setReport({}); // fallback
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GENERATE REPORT
  const generateReport = async (data) => {
    setLoading(true);
    try {
      const res = await generateInterviewReport(data);
      return res;
    } catch (err) {
      console.error("Error generating report:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  if (!authLoading && user) {
    getReports();
  }
}, [user, authLoading]);

  return {
    loading,
    report: report || {},      
    reports: Array.isArray(reports) ? reports : [], 
    generateReport,
    getReportById,
    getReports,
  };
};




