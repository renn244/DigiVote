import { Navigate, Route, Routes } from "react-router"
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import VerifyEmail from "./Pages/VerifyEmail"
import { useAuthContext } from "./context/AuthContext"

function App() {
  const { loading , user } = useAuthContext()

  if(loading) {
    return
  }

  return (
    <Routes>
      <Route path={'/'} element={user ? undefined : <Navigate to={'/login'} />} />
      <Route path="/login" element={user ? <Navigate to={'/'} /> : <Login />}   />
      <Route path="/register" element={user ? <Navigate to={'/'} /> : <SignUp />} />
      <Route path="/verifyEmail" element={user ? <Navigate to={'/'} /> : <VerifyEmail />} />
    </Routes>
  )
}

export default App
