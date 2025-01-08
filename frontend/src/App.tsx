import { Route, Routes } from "react-router"
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import VerifyEmail from "./Pages/VerifyEmail"

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/verifyEmail" element={<VerifyEmail />} />
    </Routes>
  )
}

export default App
