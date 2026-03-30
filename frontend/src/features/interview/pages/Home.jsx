import { useRef, useState } from "react";
import useInterview from "../hooks/useInterview";
import { useNavigate } from "react-router";

const Home = () => {
  const { generateReport, loading } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");

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

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col items-center justify-center px-6 py-10 gap-8">
      
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Create Your Custom{" "}
          <span className="text-pink-500">Interview Plan</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
          Let AI analyze the job requirements and your profile to build a winning strategy.
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

          {/* DIVIDER */}
          <div className="w-px bg-[#2a3348]" />

          {/* RIGHT PANEL */}
          <div className="flex-1 p-6 flex flex-col gap-4">

            <h2 className="text-sm font-semibold">Your Profile</h2>

            {/* Upload */}
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
                  <p className="text-green-400 text-sm">✅ {fileName}</p>
                ) : (
                  <>
                    <p className="text-sm">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-500">PDF or DOCX (Max 5MB)</p>
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

            {/* OR */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex-1 h-px bg-[#2a3348]" />
              OR
              <div className="flex-1 h-px bg-[#2a3348]" />
            </div>

            {/* Self Description */}
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

            {/* Info Box */}
            <div className="flex gap-2 p-3 bg-[#1b2a4a] border border-[#2d4a7a] rounded-md text-xs text-blue-300">
              <span>ℹ️</span>
              <p>
                Either a <strong className="text-white">Resume</strong> or a{" "}
                <strong className="text-white">Self Description</strong> is required.
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

      {/* FOOTER LINKS */}
      <div className="flex gap-6 text-xs text-gray-500">
        <a href="#" className="hover:text-white">Privacy</a>
        <a href="#" className="hover:text-white">Terms</a>
        <a href="#" className="hover:text-white">Help</a>
      </div>
    </div>
  );
};

export default Home;