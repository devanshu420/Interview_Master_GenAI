import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login clicked", email, password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-10 relative">
        {/* LEFT: Branding / Interview Master */}
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
            Prepare for your dream job with AI-powered mock interviews,
            personalized question sets, and role-based practice sessions.
          </p>

          <ul className="mt-4 space-y-2 text-sm md:text-base text-gray-600">
            <li>• Real-world MERN stack interview questions</li>
            <li>• Instant AI feedback on your answers</li>
            <li>• Track your progress and improve daily</li>
          </ul>
        </div>

        {/* RIGHT: Login Card */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Welcome Back
            </h2>

            <form className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-linear-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  {/* Left Icon */}
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      />
                    </svg>
                  </div>

                  {/* Input */}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  />

                  {/* Right Eye Icon */}
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      // Eye OFF
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.5.9-3.1 2.4-4.4M6.6 6.6A9.953 9.953 0 0112 5c5 0 9 4 9 7 0 1.6-1 3.3-2.7 4.7M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
                        />
                      </svg>
                    ) : (
                      // Eye ON
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

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-3.5 rounded-2xl font-semibold text-base shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6 space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Create one now
                </a>
              </p>
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
