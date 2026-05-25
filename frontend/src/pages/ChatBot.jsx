import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { chatAPI } from '../services/api'
import { useAuthStore } from '../store'

export default function ChatBot() {
  const { lessonId } = useParams()
  const user = useAuthStore((state) => state.user)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await chatAPI.message(user.id, {
        user_message: inputValue,
        lesson_id: parseInt(lessonId),
      })

      const aiMessage = {
        id: response.data.id,
        text: response.data.ai_response || 'AI thinking...',
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Tutor</h1>
        <p className="text-gray-600 text-sm">Ask any questions about the lesson</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg mb-2">👋 Welcome to AI Tutor!</p>
            <p>Ask me any questions about the lesson, and I'll help you learn.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
