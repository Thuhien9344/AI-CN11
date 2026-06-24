import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store'

// Pages
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const LessonDetail = lazy(() => import('./pages/LessonDetail'))
const ChatBot = lazy(() => import('./pages/ChatBot'))
const Quiz = lazy(() => import('./pages/Quiz'))
const ThreeDSimulation = lazy(() => import('./pages/ThreeDSimulation'))
const PersonalProgress = lazy(() => import('./pages/PersonalProgress'))
const ChapterTests = lazy(() => import('./pages/ChapterTests'))
const Classroom = lazy(() => import('./pages/Classroom'))
const SystemDesignLab = lazy(() => import('./pages/SystemDesignLab'))
const PracticeBank = lazy(() => import('./pages/PracticeBank'))
const ProjectionPractice = lazy(() => import('./pages/ProjectionPractice'))
const CircuitExperimentLab = lazy(() => import('./pages/CircuitExperimentLab'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Components
import Navigation from './components/Navigation'
import SEO from './components/SEO'

// Protected Route Component
const getDefaultRoute = (user) => (user?.role === 'teacher' ? '/classroom' : '/')

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicOnlyRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  return isAuthenticated ? <Navigate to={getDefaultRoute(user)} replace /> : children
}

const PageFallback = () => (
  <div className="page-container text-center text-slate-600">Đang tải không gian học tập...</div>
)

function App() {
  return (
    <BrowserRouter>
      <SEO />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
            color: '#0f172a',
            fontWeight: 600,
          },
        }}
      />
      <div className="min-h-screen bg-transparent">
        <Navigation />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <PersonalProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <Navigate to="/classroom" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom"
            element={
              <ProtectedRoute>
                <Classroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <Navigate to="/practice-bank" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests"
            element={
              <ProtectedRoute>
                <Navigate to="/practice-bank" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice-bank"
            element={
              <ProtectedRoute>
                <PracticeBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projection-practice"
            element={
              <ProtectedRoute>
                <ProjectionPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/design-lab"
            element={
              <ProtectedRoute>
                <SystemDesignLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/chapter-tests"
            element={
              <ProtectedRoute>
                <ChapterTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:lessonId"
            element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:lessonId/chat"
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:lessonId/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:lessonId/3d"
            element={
              <ProtectedRoute>
                <ThreeDSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:lessonId/game"
            element={
              <ProtectedRoute>
                <Navigate to="/practice-bank" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:lessonId/design"
            element={
              <ProtectedRoute>
                <SystemDesignLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:lessonId/circuit-lab"
            element={
              <ProtectedRoute>
                <CircuitExperimentLab />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
