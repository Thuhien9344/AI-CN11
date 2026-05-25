import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { coursesAPI, lessonsAPI } from '../services/api'

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      const courseRes = await coursesAPI.get(courseId)
      setCourse(courseRes.data)
      const lessonsRes = await lessonsAPI.list(courseId)
      setLessons(lessonsRes.data)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Courses
      </Link>
      {course && (
        <>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mb-8 max-w-2xl">{course.description}</p>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Lessons</h2>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition border-l-4 border-blue-500"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 text-sm">{lesson.description}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h3 className="font-semibold mb-4 text-gray-900">Course Info</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📚 {lessons.length} lessons</p>
            <p>⏱️ Estimated duration: 10 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
