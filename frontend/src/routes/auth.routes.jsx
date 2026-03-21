import {createBrowserRouter} from "react-router"
import Login from "../features/auth/pages/Login.jsx"
import Register from "../features/auth/pages/Register.jsx"
import Home from "../features/auth/pages/Home.jsx"
import Protected from "../features/auth/components/Protected.jsx"

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
    element: <Protected />,
  },
])

export default authRouter;
