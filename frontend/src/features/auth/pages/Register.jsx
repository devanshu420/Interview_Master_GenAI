import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";


const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const { handleRegister, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const res = await handleRegister({ username, email, phone, password });

    if (res?.success) {
      navigate("/");
    } else {
      setError(res?.message || "Network Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center px-6 py-10">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">
        
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">
            Join <span className="text-pink-500">Interview Master</span>
          </h1>

          <p className="text-gray-400">
            Create your account and start preparing smarter with AI-powered interview insights.
          </p>

          <ul className="space-y-2 text-sm text-gray-400 mt-4">
            <li>• AI-generated interview reports</li>
            <li>• Personalized preparation roadmap</li>
            <li>• Track your improvement</li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-[#161b22] border border-[#2a3348] rounded-xl p-6 shadow-lg">
            
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Create Account
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Username */}
              <div>
                <label className="text-xs text-gray-400">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-gray-400">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-gray-400">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4" />}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs text-gray-400">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 bg-[#1e2535] border border-[#2a3348] rounded-md p-3 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                  />
                  <span
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            {/* FOOTER */}
            <div className="text-center mt-5 text-xs text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-500 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;