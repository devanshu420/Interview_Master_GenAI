import { RouterProvider } from "react-router-dom";
import authRouter from "./routes/auth.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import InterviewContextProvider from "./features/interview/interview.context.jsx";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <InterviewContextProvider>
          <RouterProvider router={authRouter} />
        </InterviewContextProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
