import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  generateResumePdf,
} from "../api/interview.api";
import toast from "react-hot-toast";

const useInterview = () => {
  const interviewContext = useContext(InterviewContext);

  if (!interviewContext) {
    throw new Error("useInterview must be used within InterviewProvider");
  }

  const { loading, setLoading, report, setReport, allReports, setAllReports } = interviewContext;

  //  GENERATE REPORT
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

  //  GET REPORT BY ID (FIXED)
  const getReportById = async (id) => {
    setLoading(true);
    let response = null;

    try {
      response = await getInterviewReportById(id);

      console.log("Fetched API Response:", response);

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
  //  GET ALL REPORTS
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

  //  GENERATE RESUME PDF and DOWNLOAD
const getResumePdf = async (interviewReportId) => {
  setLoading(true);

  const toastId = toast.loading("Generating Resume... ⏳");

  try {
    const response = await generateResumePdf({ interviewReportId });

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Resume downloaded successfully 🎉", {
      id: toastId,
    });
  } catch (error) {
    console.error("Error downloading resume:", error);
    toast.error("Failed to generate resume ❌", {
      id: toastId,
    });
  } finally {
    setLoading(false);
  }
};

  return {
    loading,
    report,
    allReports,
    generateReport,
    getReportById,
    getAllReports,
    getResumePdf,
  };
};

export default useInterview;
