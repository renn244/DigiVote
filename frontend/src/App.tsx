import { Navigate, Route, Routes } from "react-router"
import Navbar from "./components/common/Navbar"
import ProtectedRoute from "./components/common/ProtectedRoute"
import { useAuthContext } from "./context/AuthContext"
import Admin from "./Pages/admin/Admin"
import Forbidden from "./Pages/Forbidden"
import Login from "./Pages/Login"
import NotFound from "./Pages/NotFound"
import SignUp from "./Pages/SignUp"
import VerifyEmail from "./Pages/VerifyEmail"
import Elections from "./Pages/Elections"
import Election from "./Pages/Election"
import PollVote from "./Pages/PollVote"

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
        <Route path="/notfound" element={<NotFound />}   />

        <Route path="/elections" element={<Elections />} />
        <Route path="/elections/:id" element={<Election />} />

        <Route path="/pollVote/:id" element={<PollVote />} />  

        <Route path="/admin/*" element={
          <ProtectedRoute roles={['admin']}>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
