import { create } from 'zustand'
import { authAPI } from '../services/api'

// Auth Store
export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.login({ username, password })
      const { access_token, user } = response.data
      localStorage.setItem('token', access_token)
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        isLoading: false,
      })
      return false
    }
  },

  register: async (username, email, password, full_name) => {
    set({ isLoading: true, error: null })
    try {
      await authAPI.register({
        username,
        email,
        password,
        full_name,
        role: 'student',
      })
      set({ isLoading: false })
      return true
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Registration failed',
        isLoading: false,
      })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  clearError: () => set({ error: null }),
}))

// Courses Store
export const useCoursesStore = create((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async (skip = 0, limit = 10) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/courses?skip=${skip}&limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      set({ courses: data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
}))

// Lessons Store
export const useLessonsStore = create((set) => ({
  lessons: [],
  currentLesson: null,
  isLoading: false,
  error: null,

  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  fetchLessons: async (courseId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`)
      if (!response.ok) throw new Error('Failed to fetch lessons')
      const data = await response.json()
      set({ lessons: data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
}))

// Quiz Store
export const useQuizStore = create((set) => ({
  currentQuestion: null,
  answers: [],
  score: 0,
  isLoading: false,
  error: null,

  setCurrentQuestion: (question) => set({ currentQuestion: question }),

  addAnswer: (answer) => set((state) => ({
    answers: [...state.answers, answer],
  })),

  resetQuiz: () => set({
    currentQuestion: null,
    answers: [],
    score: 0,
    error: null,
  }),
}))

// Chat Store
export const useChatStore = create((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),

  setMessages: (messages) => set({ messages }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))
