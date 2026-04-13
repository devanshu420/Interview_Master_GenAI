import { useEffect, useRef, useState } from "react";
import useInterview from "../hooks/useInterview";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const Home = () => {
  const { generateReport, loading, getAllReports, report } = useInterview();
  const { handleLogOut } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [recentReport, setRecentReport] = useState(null);

  const navigate = useNavigate();
  const interviewFileRef = useRef();

  const handleGenerateReport = async () => {
    const resumeFile = interviewFileRef.current.files[0];

    if (!jobDescription) {
      alert("Job description is required");
      return;
    }

    if (!resumeFile && !selfDescription) {
      alert("Either resume or self description is required");
      return;
    }

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    if (data?.success) {
      const interviewId = data.data._id;
      navigate(`/interview/${interviewId}`);
    }
  };

  //  LOGOUT HANDLER
  const handleLogout = () => {
    handleLogOut();
    navigate("/login");
  };

  const handleAllReports = () => {
    navigate("/all-reports");
  };

  useEffect(() => {
    const fetchRecentReport = async () => {
      const res = await getAllReports();

      if (res?.interviewReports?.length > 0) {
        setRecentReport(res.interviewReports[0]); // latest report
      }
    };

    fetchRecentReport();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col items-center justify-center px-6 py-10 gap-8 relative">
      {/*  SIGN OUT BUTTON (TOP RIGHT) */}
      <button
        onClick={handleAllReports}
        className="absolute top-6 right-32 flex items-center gap-2 px-4 py-1.5 text-sm font-medium 
            bg-pink-500/10 text-green-400 border border-pink-500/30 
            rounded-md hover:bg-pink-400 hover:text-white transition cursor-pointer"
      >
        📄 My Reports
      </button>

      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-1.5 text-sm 
                    border border-pink-500/30 
                   text-pink-400 
                    bg-pink-500/10 
                    rounded-md 
                    hover:bg-pink-500/20 
                    hover:text-pink-300 
                    hover:border-pink-500 
                    transition cursor-pointer"
      >
        Sign Out
      </button>

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Create Your Custom{" "}
          <span className="text-pink-500">Interview Plan</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
          Let AI analyze the job requirements and your profile to build a
          winning strategy.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl bg-[#161b22] border border-[#2a3348] rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-130">
          {/* LEFT PANEL */}
          <div className="flex-1 p-6 relative">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-semibold">Target Job Description</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/30">
                Required
              </span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full h-72 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none"
            />

            <span className="absolute bottom-6 right-6 text-xs text-gray-500">
              {jobDescription.length} / 5000
            </span>
          </div>

          <div className="w-px bg-[#2a3348]" />

          {/* RIGHT PANEL */}
          <div className="flex-1 p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Your Profile</h2>

            <div>
              <label className="text-xs text-gray-300">
                Upload Resume
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/30">
                  Best
                </span>
              </label>

              <label
                htmlFor="resumeUpload"
                className="mt-2 flex flex-col items-center justify-center gap-1 p-6 bg-[#1e2535] border-2 border-dashed border-[#2a3348] rounded-md cursor-pointer hover:border-pink-500 hover:bg-pink-500/5 transition"
              >
                {fileName ? (
                  <p className="text-green-400 text-sm"> {fileName}</p>
                ) : (
                  <>
                    <p className="text-sm">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-500">
                      PDF or DOCX (Max 5MB)
                    </p>
                  </>
                )}
              </label>

              <input
                ref={interviewFileRef}
                id="resumeUpload"
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFileName(file?.name || "");
                }}
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex-1 h-px bg-[#2a3348]" />
              OR
              <div className="flex-1 h-px bg-[#2a3348]" />
            </div>

            <div>
              <label className="text-xs text-gray-300">
                Quick Self-Description
              </label>

              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                className="w-full mt-2 h-24 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none"
                placeholder="Describe your skills..."
              />
            </div>

            <div className="flex gap-2 p-3 bg-[#1b2a4a] border border-[#2d4a7a] rounded-md text-xs text-blue-300">
              <span>ℹ️</span>
              <p>
                Either a <strong className="text-white">Resume</strong> or a{" "}
                <strong className="text-white">Self Description</strong> is
                required.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a3348]">
          <span className="text-xs text-gray-500">
            AI-Powered Strategy • ~30s
          </span>

          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition
            ${
              loading
                ? "bg-pink-400 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Plan"
            )}
          </button>
        </div>
      </div>

      {/* RECENT REPORT */}
      {recentReport && (
        <div className="w-full max-w-5xl bg-[#161b22] border border-[#2a3348] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Recent <span className="text-pink-500">Report</span>
            </h2>

            <button
              onClick={handleAllReports}
              className="text-xs text-pink-400 hover:text-pink-300"
            >
              View All →
            </button>
          </div>

          <div
            onClick={() => navigate(`/interview/${recentReport._id}`)}
            className="bg-[#1e2535] border border-[#2a3348] rounded-lg p-4 hover:border-pink-500/40 transition cursor-pointer"
          >
            <h3 className="text-md font-semibold text-white">
              {recentReport.title || "Interview Report"}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(recentReport.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm text-gray-400">Match Score</span>

              <span
                className={`px-3 py-1 text-xs font-semibold rounded-md border
          ${
            recentReport.matchScore >= 85
              ? "text-green-400 border-green-400/30 bg-green-400/10"
              : recentReport.matchScore >= 70
                ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                : "text-red-400 border-red-400/30 bg-red-400/10"
          }`}
              >
                {recentReport.matchScore}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER LINKS */}
      <div className="flex gap-6 text-xs text-gray-500">
        <a href="#" className="hover:text-white">
          Privacy
        </a>
        <a href="#" className="hover:text-white">
          Terms
        </a>
        <a href="#" className="hover:text-white">
          Help
        </a>
      </div>
    </div>
  );
};

export default Home;
