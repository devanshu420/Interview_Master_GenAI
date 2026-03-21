import { RouterProvider } from "react-router-dom";
import authRouter from "./routes/auth.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={authRouter} />
      </AuthProvider>
    </div>
  );
};

export default App;
