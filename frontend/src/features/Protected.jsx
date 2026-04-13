import { Navigate } from "react-router";
import { useAuth } from "./auth/hooks/useAuth.js";
import Home from "./interview/pages/Home.jsx";
import ReportPage from "./interview/pages/Interview.jsx";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  //  IMPORTANT CHANGE
  return children;
};

export default Protected;
