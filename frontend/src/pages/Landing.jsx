import { useNavigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { user, handleLogOut } = useAuth();

  const handleLogout = () => {
    handleLogOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">

      {/* 🔝 NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur bg-[#0d1117]/70 border-b border-[#2a3348] px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">
          <span className="text-pink-500">AI</span> Interview Prep
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          {user ? (
            <>
              <button
                onClick={() => navigate("/all-reports")}
                className="px-3 py-1 rounded-md bg-pink-500/10 text-green-400 border border-pink-500/30 hover:bg-pink-500/20"
              >
                📄 My Reports
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md border border-pink-500/30 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="hover:text-white">
              Login
            </button>
          )}
        </div>
      </div>

      {/* 🦸 HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Crack Interviews with{" "}
          <span className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            AI Power
          </span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl">
          Upload your resume and job description to get personalized interview
          questions, roadmap, and ATS resume.
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(user ? "/home" : "/login")}
            className="px-6 py-3 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 hover:scale-105 transition cursor-pointer"
          >
            🚀 Get Started
          </button>
        </div>
      </section>

      {/* ⚡ FEATURES */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Powerful <span className="text-pink-500">Features</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "AI Resume Analysis",
            "Technical Questions",
            "Behavioral Questions",
            "Personalized Roadmap",
            "Match Score System",
            "ATS Resume Generator",
          ].map((feature, i) => (
            <div
              key={i}
              className="p-5 bg-[#161b22] border border-[#2a3348] rounded-xl hover:border-pink-500/40 hover:scale-[1.02] transition"
            >
              <h3 className="font-semibold mb-2">{feature}</h3>
              <p className="text-sm text-gray-400">
                Smart AI-powered insights to boost your interview preparation.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 HOW IT WORKS */}
      <section className="px-6 py-16 bg-[#11161d]">
        <h2 className="text-2xl font-bold text-center mb-10">
          How It <span className="text-pink-500">Works</span>
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-5xl mx-auto">
          {[
            "Upload Resume or Description",
            "Paste Job Description",
            "Get AI Interview Plan",
          ].map((step, i) => (
            <div
              key={i}
              className="flex-1 p-5 bg-[#161b22] border border-[#2a3348] rounded-xl text-center"
            >
              <p className="text-pink-500 font-bold mb-2">Step {i + 1}</p>
              <p className="text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📊 DEMO */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          See It In <span className="text-pink-500">Action</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-[#161b22] rounded-xl border border-[#2a3348]">
            <p className="text-sm text-gray-400">Questions Preview</p>
          </div>
          <div className="p-4 bg-[#161b22] rounded-xl border border-[#2a3348]">
            <p className="text-sm text-gray-400">Roadmap Timeline</p>
          </div>
          <div className="p-4 bg-[#161b22] rounded-xl border border-[#2a3348]">
            <p className="text-sm text-gray-400">Match Score</p>
          </div>
        </div>
      </section>

      {/* 🌟 TESTIMONIALS */}
      <section className="px-6 py-16 bg-[#11161d]">
        <h2 className="text-2xl font-bold text-center mb-10">
          What Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {["Rahul", "Aman", "Priya"].map((name, i) => (
            <div
              key={i}
              className="p-5 bg-[#161b22] border border-[#2a3348] rounded-xl"
            >
              <p className="text-sm text-gray-400">
                “This app helped me crack my interview with confidence!”
              </p>
              <p className="mt-3 text-pink-400 text-sm">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Interview Preparation Today
        </h2>

        <button
          onClick={() => navigate(user ? "/home" : "/login")}
          className="px-8 py-3 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 hover:scale-105 transition cursor-pointer"
        >
          Get Started Now
        </button>
      </section>

      {/* 🧾 FOOTER */}
      <footer className="text-center text-xs text-gray-500 py-6 border-t border-[#2a3348]">
        <div className="flex justify-center gap-6 mb-2">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
        © 2026 AI Interview Prep • Built with ❤️
      </footer>

    </div>
  );
};

export default Landing;