import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { handleLogin, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await handleLogin({ email, password });

    if (res?.success) {
      navigate("/");
    } else {
      setError(res?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center px-6 py-10">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">
        
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">
            Welcome to <span className="text-pink-500">Interview Master</span>
          </h1>

          <p className="text-gray-400">
            Practice interviews, get AI feedback, and improve your chances of landing your dream job.
          </p>

          <ul className="space-y-2 text-sm text-gray-400 mt-4">
            <li>• AI-generated interview questions</li>
            <li>• Personalized preparation roadmap</li>
            <li>• Track your performance</li>
          </ul>
        </div>

        {/* RIGHT SIDE (LOGIN CARD) */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-[#161b22] border border-[#2a3348] rounded-xl p-6 shadow-lg">
            
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Sign In
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* EMAIL */}
              <div>
                <label className="text-xs text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-xs text-gray-400">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                  />

                  {/* TOGGLE */}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3  top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4" />}
                  </span>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md text-sm font-semibold transition
                ${
                  loading
                    ? "bg-pink-400 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* FOOTER */}
            <div className="text-center mt-5 text-xs text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-pink-500 hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;