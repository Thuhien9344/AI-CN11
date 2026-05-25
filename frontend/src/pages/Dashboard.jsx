import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { coursesAPI } from '../services/api'

export default function Dashboard() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await coursesAPI.list()
      setCourses(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading courses...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Choose a course to start learning</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  View Course
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
