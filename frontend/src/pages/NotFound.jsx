import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white mb-8">Page Not Found</p>
        <p className="text-white mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
