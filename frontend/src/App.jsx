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
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
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

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
