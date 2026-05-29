import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CourseDetail from './pages/CourseDetail'
import LessonDetail from './pages/LessonDetail'
import ChatBot from './pages/ChatBot'
import Quiz from './pages/Quiz'
import ThreeDSimulation from './pages/ThreeDSimulation'
import EngineGame from './pages/EngineGame'
import PersonalProgress from './pages/PersonalProgress'
import ChapterTests from './pages/ChapterTests'
import Classroom from './pages/Classroom'
import WarmupGameArena from './pages/WarmupGameArena'
import SystemDesignLab from './pages/SystemDesignLab'
import FunContests from './pages/FunContests'
import PracticeBank from './pages/PracticeBank'
import NotFound from './pages/NotFound'

// Components
import Navigation from './components/Navigation'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
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
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
                <WarmupGameArena />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests"
            element={
              <ProtectedRoute>
                <FunContests />
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
                <EngineGame />
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

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
