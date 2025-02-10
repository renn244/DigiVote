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
import FinishedVote from "./Pages/FinishedVote"
import ViewYourVote from "./Pages/ViewYourVote"
import VoteHistory from "./Pages/VoteHistory"
import Settings from "./Pages/Settings"
import Help from "./Pages/Help"
import Results from "./Pages/Results"
import Result from "./Pages/Result"
import AuthenticatedRoute from "./components/common/AuthenticatedRoute"
import ForgotPassword from "./Pages/Forgot-password"
import ResetPassword from "./Pages/ResetPassword"
import About from "./Pages/About"
import Homepage from "./Pages/Homepage"
import Contact from "./Pages/Contact"
import Privacy from "./Pages/Privacy"
import LiveResult from "./Pages/LiveResult"

function App() {
  const { loading , user } = useAuthContext()

  if(loading) {
    return
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/login" element={user ? <Navigate to={'/'} /> : <Login />}   />
        <Route path="/register" element={user ? <Navigate to={'/'} /> : <SignUp />} />
        <Route path="/forgot-password" element={user ? <Navigate to={'/'} /> : <ForgotPassword /> } />
        <Route path="/resetPassword" element={user ? <Navigate to={'/'} /> : <ResetPassword />} />
        <Route path="/verifyEmail" element={user ? <Navigate to={'/'} /> : <VerifyEmail />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/notfound" element={<NotFound />}   />
        <Route path="*" element={<Navigate to={'/notfound'} />} />

        <Route path="/elections" element={
          <AuthenticatedRoute>
            <Elections />
          </AuthenticatedRoute>
        } />
        <Route path="/elections/:id" element={
          <AuthenticatedRoute>
            <Election />
          </AuthenticatedRoute>
        } />

        <Route path="/live-results/:pollId" element={
          <AuthenticatedRoute>
            <LiveResult />
          </AuthenticatedRoute>
        } />        

        <Route path="/results" element={
          <AuthenticatedRoute>
            <Results />
          </AuthenticatedRoute>
        } />
        <Route path="/results/:id" element={
          <AuthenticatedRoute>
            <Result />
          </AuthenticatedRoute>
        } />

        <Route path="/viewFinishVote/:id" element={
          <AuthenticatedRoute>
            <ViewYourVote />
          </AuthenticatedRoute>
        } />
        <Route path="/finishVote" element={
          <AuthenticatedRoute>
            <FinishedVote />
          </AuthenticatedRoute>
        } />

        <Route path="/history" element={
          <AuthenticatedRoute>
            <VoteHistory />
          </AuthenticatedRoute>
        } />
        <Route path="/help" element={
          <AuthenticatedRoute>
            <Help />
          </AuthenticatedRoute>
        } />
        <Route path="/settings" element={
          <AuthenticatedRoute>
            <Settings />
          </AuthenticatedRoute>
        } />
   
        <Route path="/pollVote/:id" element={
          <AuthenticatedRoute>
            <PollVote />
          </AuthenticatedRoute>
        } />

        <Route path="/admin/*" element={
          <AuthenticatedRoute>
            <ProtectedRoute roles={['admin']}>
              <Admin />
            </ProtectedRoute>
          </AuthenticatedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
