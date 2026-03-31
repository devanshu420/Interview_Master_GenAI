import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Protected from "../features/Protected.jsx";
import Interview from "../features/interview/pages/Interview.jsx";
import Home from "../features/interview/pages/Home.jsx";
import AllReport from "../features/interview/pages/AllReport.jsx";

const authRouter = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    path: "/all-reports",
    element: (
      <Protected>
        <AllReport />
      </Protected>
    ),
  },
]);

export default authRouter;
