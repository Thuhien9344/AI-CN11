import { Link } from 'react-router-dom'
import { useAuthStore } from '../store'

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuthStore()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🎓 AI Education
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
