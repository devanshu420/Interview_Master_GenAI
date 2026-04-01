import { RouterProvider } from "react-router-dom";
import authRouter from "./routes/auth.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import InterviewContextProvider from "./features/interview/interview.context.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <InterviewContextProvider>          
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: "#1c2230",
                color: "#fff",
                border: "1px solid #2a3348",
              },
            }}
          />
          <RouterProvider router={authRouter} />
        </InterviewContextProvider>
      </AuthProvider>
    </div>
  );
};

export default App;