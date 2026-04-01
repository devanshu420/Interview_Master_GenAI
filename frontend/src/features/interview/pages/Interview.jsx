import React, { useState, useEffect } from "react";
import useInterview from "../hooks/useInterview.jsx";
import { useParams } from "react-router";
import { useNavigate } from "react-router";


// ── Navigation Items ──
const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "roadmap", label: "Road Map" },
];

// ── Question Card ──
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#1c2230] border border-[#2a3348] rounded-lg overflow-hidden hover:border-[#3a455f] transition">
      <div
        onClick={() => setOpen(!open)}
        className="flex gap-3 p-4 cursor-pointer"
      >
        <span className="text-xs font-bold text-pink-500 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
          Q{index + 1}
        </span>

        <p className="flex-1 text-sm text-gray-200">{item?.question}</p>

        <span
          className={`transition ${
            open ? "rotate-180 text-pink-500" : "text-gray-400"
          }`}
        >
          ▼
        </span>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-[#2a3348] space-y-3">
          <div>
            <span className="text-xs font-bold text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded">
              Intention
            </span>
            <p className="text-sm text-gray-400 mt-1">{item?.intention}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded">
              Model Answer
            </span>
            <p className="text-sm text-gray-400 mt-1">{item?.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Roadmap ──
const RoadMapDay = ({ day }) => (
  <div className="relative pl-10 py-3">
    <div className="absolute left-3 top-5 w-3 h-3 rounded-full border-2 border-pink-500 bg-[#161b22]" />

    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-pink-500 bg-pink-500/10 border border-pink-500/25 px-2 rounded-full">
        Day {day?.day}
      </span>
      <h3 className="text-sm font-semibold text-white">{day?.focus}</h3>
    </div>

    <ul className="mt-2 space-y-1">
      {day?.tasks?.map((task, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-400">
          <span className="w-1 h-1 mt-2 bg-gray-500 rounded-full" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

// ── Main Component ──
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, getReportById, loading , getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  console.log("ID:", interviewId);
  console.log("REPORT:", report);

  // ✅ FIXED API CALL
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId); // ✅ string pass karna hai
    }
  }, [interviewId]);

  // ✅ LOADING UI (Better UX)
  if (loading || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Generating your AI Interview Plan...</p>
      </div>
    );
  }

  // ✅ Score color
  const scoreColor =
    report?.matchScore >= 80
      ? "border-green-500"
      : report?.matchScore >= 60
        ? "border-yellow-400"
        : "border-red-500";
  
  
  const handleGenerateResume = async() => {
    const res = await getResumePdf(interviewId);
    console.log("Generate Resume Response" , res);
    
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 flex justify-center relative">
      <div className="flex w-full max-w-6xl bg-[#161b22] border border-[#2a3348] rounded-xl">
        {/* ── Left Nav ── */}
        <div className="w-56 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase">Sections</p>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 
                ${
                  activeNav === item.id
                    ? "bg-pink-500/10 text-pink-500"
                    : "text-gray-400 hover:bg-[#1c2230] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[#2a3348]">
 <button
  onClick={() => handleGenerateResume()}
  disabled={loading}
  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
  bg-linear-to-r from-pink-500 to-purple-600 
  text-white text-sm font-semibold 
  shadow-md transition-all duration-200 cursor-pointer
  ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}
  `}
>
  {loading ? (
    <>
      {/* Spinner */}
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Generating Resume...
    </>
  ) : (
    <>
      <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
      Download Resume
    </>
  )}
</button>
</div>
        </div>

        {/* Divider */}
        <div className="w-px bg-[#2a3348]" />

        {/* ── Content ── */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[90vh]">
          {/* Technical */}
          {activeNav === "technical" && (
            <>
              <h2 className="text-lg font-bold mb-4">Technical Questions</h2>
              <div className="space-y-3">
                {report?.technicalQuestions?.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </>
          )}

          {/* Behavioral */}
          {activeNav === "behavioral" && (
            <>
              <h2 className="text-lg font-bold mb-4">Behavioral Questions</h2>
              <div className="space-y-3">
                {report?.behavioralQuestions?.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </>
          )}

          {/* Roadmap */}
          {activeNav === "roadmap" && (
            <>
              <h2 className="text-lg font-bold mb-4">Preparation Roadmap</h2>
              <div className="relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-pink-500/40">
                {report?.preparationPlan?.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px bg-[#2a3348]" />

        {/* ── Sidebar ── */}
        <div className="w-60 p-5 space-y-6">
          {/* Score */}
          {/* Score + Back */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Match Score</p>

              {/* BACK BUTTON */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm px-3 py-1.5 border border-pink-500/30 text-pink-400 bg-pink-500/10 rounded-md hover:bg-pink-500/20 transition cursor-pointer"
              >
                ← Back
              </button>
            </div>

            <div
              className={`w-20 h-20 flex flex-col items-center justify-center rounded-full border-4 ${scoreColor}`}
            >
              <span className="text-xl font-bold">{report?.matchScore}</span>
              <span className="text-xs text-gray-400">%</span>
            </div>
          </div>

          {/* Skill Gaps */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Skill Gaps</p>
            <div className="flex flex-wrap gap-2">
              {report?.skillGaps?.map((gap, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded border
                  ${gap.severity === "high" && "text-red-400 border-red-400/30 bg-red-400/10"}
                  ${gap.severity === "medium" && "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"}
                  ${gap.severity === "low" && "text-green-400 border-green-400/30 bg-green-400/10"}
                  `}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
