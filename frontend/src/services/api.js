import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
}

// Courses
export const coursesAPI = {
  list: (skip = 0, limit = 10) => api.get('/api/courses', { params: { skip, limit } }),
  get: (id) => api.get(`/api/courses/${id}`),
  create: (data) => api.post('/api/courses', data),
  update: (id, data) => api.put(`/api/courses/${id}`, data),
  delete: (id) => api.delete(`/api/courses/${id}`),
}

// Lessons
export const lessonsAPI = {
  list: (courseId) => api.get(`/api/courses/${courseId}/lessons`),
  get: (id) => api.get(`/api/lessons/${id}`),
  create: (data) => api.post('/api/lessons', data),
  update: (id, data) => api.put(`/api/lessons/${id}`, data),
  delete: (id) => api.delete(`/api/lessons/${id}`),
}

// Questions
export const questionsAPI = {
  list: (lessonId) => api.get(`/api/lessons/${lessonId}/questions`),
  get: (id) => api.get(`/api/questions/${id}`),
  create: (data) => api.post('/api/questions', data),
  update: (id, data) => api.put(`/api/questions/${id}`, data),
  delete: (id) => api.delete(`/api/questions/${id}`),
}

// Quiz
export const quizAPI = {
  submit: (userId, data) => api.post(`/api/quiz/submit?user_id=${userId}`, data),
  getResults: (userId, skip = 0, limit = 50) =>
    api.get(`/api/quiz/results/user/${userId}`, { params: { skip, limit } }),
  getStats: (questionId) => api.get(`/api/quiz/results/question/${questionId}`),
}

// Chat
export const chatAPI = {
  message: (userId, data) => api.post(`/api/chat/message?user_id=${userId}`, data),
  history: (userId, lessonId = null, skip = 0, limit = 50) =>
    api.get(`/api/chat/history/${userId}`, {
      params: { lesson_id: lessonId, skip, limit }
    }),
}

export default api
