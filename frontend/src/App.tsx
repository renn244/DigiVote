import { Navigate, Route, Routes } from "react-router"
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import VerifyEmail from "./Pages/VerifyEmail"
import { useAuthContext } from "./context/AuthContext"
import Navbar from "./components/common/Navbar"
import Forbidden from "./Pages/Forbidden"
import ProtectedRoute from "./components/common/ProtectedRoute"
import Admin from "./Pages/admin/Admin"

function App() {
  const { loading , user } = useAuthContext()

  if(loading) {
    return
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path={'/'} element={user ? undefined : <Navigate to={'/login'} />} />
        <Route path="/login" element={user ? <Navigate to={'/'} /> : <Login />}   />
        <Route path="/register" element={user ? <Navigate to={'/'} /> : <SignUp />} />
        <Route path="/verifyEmail" element={user ? <Navigate to={'/'} /> : <VerifyEmail />} />
        <Route path="/forbidden" element={<Forbidden />} />

        <Route path="/admin/*" element={
          <ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
