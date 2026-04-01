import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/**
 * @description Generate Interview Report
 * @param {Object} jobDescription, resumeFile, selfDescription -
 * @returns {Object} Interview report
 */
export const generateInterviewReport = async ({
  jobDescription,
  resumeFile,
  selfDescription,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);

  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  const response = await api.post("/api/interview/generate-report", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * @description Get Interview Report
 * @param {String} interviewId -
 * @returns {Object} Interview report
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/getReport/${interviewId}`);
  return response.data;
};

/**
 * @description Get All Interview Reports
 * @returns {Object} All Interview reports
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/getAllReports");
  return response.data;
};

/**
 * @description Generate Resume PDF
 * @param {Object} interviewReportId -
 * @returns {Object} Resume PDF
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(`/api/interview/generate-resume-pdf/${interviewReportId}`, null, {
    responseType: "blob"
  })
  return response.data
};

