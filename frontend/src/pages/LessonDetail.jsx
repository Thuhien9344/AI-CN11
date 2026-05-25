import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { lessonsAPI } from '../services/api'

export default function LessonDetail() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const response = await lessonsAPI.get(lessonId)
      setLesson(response.data)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">{lesson?.title}</h1>
        <p className="text-gray-600">{lesson?.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Content</h2>
            <div className="prose max-w-none">
              {lesson?.content || <p className="text-gray-600">Lesson content coming soon...</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-gray-900">Learning Tools</h3>
            <div className="space-y-3">
              <Link
                to={`/lessons/${lessonId}/3d`}
                className="block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
              >
                🎲 3D Simulation
              </Link>
              <Link
                to={`/lessons/${lessonId}/chat`}
                className="block bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition"
              >
                💬 AI Chat
              </Link>
              <Link
                to={`/lessons/${lessonId}/quiz`}
                className="block bg-purple-600 text-white text-center py-2 rounded hover:bg-purple-700 transition"
              >
                📝 Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
