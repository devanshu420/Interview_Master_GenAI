import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Home from "../pages/Home";

const Protected = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <>
      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Loading...
      </>
    )
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <Home />
    </>
  );
};

export default Protected;
