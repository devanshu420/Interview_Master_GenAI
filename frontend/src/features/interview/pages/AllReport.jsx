import { useNavigate } from "react-router";
import useInterview from "../hooks/useInterview";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

const AllReport = () => {
  const navigate = useNavigate();
  const { getAllReports } = useInterview();

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await getAllReports();

      if (response?.interviewReports) {
        setReports(response.interviewReports);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] px-6 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Your <span className="text-pink-500">Interview Reports</span>
        </h1>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-1.5 text-sm border border-pink-500/30 text-pink-400 bg-pink-500/10 rounded-md hover:bg-pink-500/20 transition"
        >
          ← Back
        </button>
      </div>

      {/* REPORT LIST */}
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        {reports.map((report) => (
          <div
            key={report._id}
            className="bg-[#161b22] border border-[#2a3348] rounded-xl p-5 hover:border-pink-500/40 hover:bg-[#1a2130] transition cursor-pointer"
          >
            {/* TOP ROW */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white leading-snug">
                  {report.title}
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Created on {formatDate(report.createdAt)}
                </p>
              </div>

              <div
                className={`px-3 py-1 text-sm font-semibold rounded-md border
                ${
                  report.matchScore >= 85
                    ? "text-green-400 border-green-400/30 bg-green-400/10"
                    : report.matchScore >= 70
                      ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                      : "text-red-400 border-red-400/30 bg-red-400/10"
                }`}
              >
                {report.matchScore}%
              </div>
            </div>

            {/* JOB DESCRIPTION */}
            <p className="text-sm text-gray-400 mt-4 line-clamp-2">
              {report.jobDescription}
            </p>

            {/* FOOTER */}
            {/* FOOTER */}
            <div className="flex justify-between items-center mt-5">
              <span className="text-xs text-gray-500">AI Generated Report</span>

              <div className="flex gap-2">
                {/* DOWNLOAD BUTTON */}
                <button
                  className="flex items-center gap-2 px-4 py-1.5 text-sm border border-green-500/30 text-green-400 bg-green-500/10 rounded-md hover:bg-green-500/20 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Download report:", report._id);
                  }}
                >
                  <Download size={16} />
                </button>

                {/* VIEW DETAILS */}
                <button
                  className="px-4 py-1.5 text-sm bg-pink-500 hover:bg-pink-600 rounded-md transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    navigate(`/interview/${report._id}`);
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {reports.length === 0 && (
        <div className="text-center mt-20 text-gray-500">No reports found.</div>
      )}
    </div>
  );
};

export default AllReport;
