import { RouterProvider } from "react-router-dom"
import authRouter from "./routes/auth.routes.jsx"

const App = () => {
  return (
    <div>
      <RouterProvider router={authRouter} />
    </div>
  )
}

export default App