import React, { useState, useEffect } from "react";
import useInterview from "../hooks/useInterview.jsx";
import { useParams } from "react-router";

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
  const { report, getReportById, loading } = useInterview();
  const { interviewId } = useParams();

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

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 flex justify-center">
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
          <div>
            <p className="text-xs text-gray-400 mb-2">Match Score</p>

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
