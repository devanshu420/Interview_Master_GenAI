import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
} from "../api/interview.api";

const useInterview = () => {
  const interviewContext = useContext(InterviewContext);

  if (!interviewContext) {
    throw new Error("useInterview must be used within InterviewProvider");
  }

  const { loading, setLoading, report, setReport, allReports, setAllReports } =
    interviewContext;

  // ✅ GENERATE REPORT
  const generateReport = async ({
    jobDescription,
    resumeFile,
    selfDescription,
  }) => {
    setLoading(true);
    let response = null;

    try {
      response = await generateInterviewReport({
        jobDescription,
        resumeFile,
        selfDescription,
      });

      console.log("API Response:", response);

      if (response?.data) {
        setReport(response.data);
      }
    } catch (error) {
      console.error("Generate Error:", error);
    } finally {
      setLoading(false);
    }

    return response;
  };

  // ✅ GET REPORT BY ID (FIXED)
  const getReportById = async (id) => {
    setLoading(true);
    let response = null;

    try {
      response = await getInterviewReportById(id);

      console.log("Fetched API Response:", response);

      // ✅ yaha fix hai
      if (response?.data) {
        setReport(response.data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }

    return response;
  };
  // ✅ GET ALL REPORTS
  const getAllReports = async () => {
    setLoading(true);
    let response = null;

    try {
      response = await getAllInterviewReports();

      if (response?.data) {
        setAllReports(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    return response;
  };

  return {
    loading,
    report,
    allReports,
    generateReport,
    getReportById,
    getAllReports,
  };
};

export default useInterview;
