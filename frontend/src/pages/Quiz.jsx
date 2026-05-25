import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { questionsAPI, quizAPI } from '../services/api'
import { useAuthStore } from '../store'

export default function Quiz() {
  const { lessonId } = useParams()
  const user = useAuthStore((state) => state.user)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [lessonId])

  const fetchQuestions = async () => {
    try {
      const response = await questionsAPI.list(lessonId)
      setQuestions(response.data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = async (optionId) => {
    const question = questions[currentIndex]
    const isCorrect = question.options.some((opt) => opt.id === optionId && opt.is_correct)

    try {
      await quizAPI.submit(user.id, {
        question_id: question.id,
        selected_answer: optionId.toString(),
        time_spent_seconds: 30,
      })

      if (isCorrect) {
        setScore((prev) => prev + 1)
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        setQuizSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading quiz...</div>

  if (questions.length === 0) {
    return <div className="p-8 text-center text-gray-600">No questions available for this lesson.</div>
  }

  if (quizSubmitted) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Quiz Complete!</h1>
          <div className="mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {percentage}%
            </div>
            <p className="text-xl text-gray-600">
              You got {score} out of {questions.length} correct
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentIndex(0)
              setScore(0)
              setQuizSubmitted(false)
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentIndex]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Question {currentIndex + 1} of {questions.length}</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {question.points} points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">{question.text}</h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              className="w-full text-left p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3"></div>
                <span className="text-gray-900">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
