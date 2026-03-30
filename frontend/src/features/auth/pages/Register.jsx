import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

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
    console.log("User Data : ", email, username, password, phone);

    const res = await handleRegister({ username, email, phone, password });

    if (res?.success) {
      navigate("/");
    } else {
      setError(res?.message || "Network Error");
    }
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-10">
        {/* LEFT: Branding - same style as Login */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Interview Master
            </h1>
          </div>

          <p className="text-base md:text-lg text-gray-600 max-w-md">
            Create your account to start personalized, AI-powered interview
            practice tailored to your skills and career goals.
          </p>

          <ul className="mt-4 space-y-2 text-sm md:text-base text-gray-600">
            <li>• Practice by role, level, and tech stack</li>
            <li>• Save attempts and track your growth</li>
            <li>• Get smarter with every session</li>
          </ul>
        </div>

        {/* RIGHT: Register Card */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Create Account
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-linear-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-linear-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-linear-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>

              {/* Password */}
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 pr-12 py-3 bg-linear-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  />

                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      // Eye Off
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.5.9-3.1 2.4-4.4M6.6 6.6A9.953 9.953 0 0112 5c5 0 9 4 9 7 0 1.6-1 3.3-2.7 4.7M15 12a3 3 0 11-6 0m12 6L3 3"
                        />
                      </svg>
                    ) : (
                      // Eye On
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c-1.5 3-5 7-9 7s-7.5-4-9-7c1.5-3 5-7 9-7s7.5 4 9 7z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 pr-12 py-3 bg-linear-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  />

                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      // Eye Off
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7M6.6 6.6A9.953 9.953 0 0112 5c5 0 9 4 9 7m-6 0a3 3 0 11-6 0m12 6L3 3"
                        />
                      </svg>
                    ) : (
                      // Eye On
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c-1.5 3-5 7-9 7s-7.5-4-9-7c1.5-3 5-7 9-7s7.5 4 9 7z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              {/* 🔴 Error Message */}
              {error && (
                <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-3.5 rounded-2xl font-semibold text-base shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
