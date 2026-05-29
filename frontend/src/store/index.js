import { create } from 'zustand'
import { authAPI } from '../services/api'

const LOCAL_USERS_KEY = 'local_auth_users'
const LOCAL_CURRENT_USER_KEY = 'local_auth_current_user'
const LOCAL_PROFILE_META_KEY = 'local_profile_meta'

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]')
  } catch {
    return []
  }
}

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

const getProfileMeta = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PROFILE_META_KEY) || '{}')
  } catch {
    return {}
  }
}

const saveProfileMeta = (username, meta) => {
  const profiles = getProfileMeta()
  profiles[username] = {
    ...(profiles[username] || {}),
    ...meta,
  }
  localStorage.setItem(LOCAL_PROFILE_META_KEY, JSON.stringify(profiles))
}

const getProfileForUser = (username) => getProfileMeta()[username] || {}

const getLocalCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CURRENT_USER_KEY) || 'null')
  } catch {
    return null
  }
}

const createLocalToken = (username) => `local-token-${username}-${Date.now()}`

const normalizeRole = (role) => role || 'student'

const saveLocalRegistration = ({ username, email, password, full_name, role, student_class }) => {
  const users = getLocalUsers()
  const exists = users.some(
    (user) => user.username === username || user.email === email
  )

  if (exists) {
    return {
      success: false,
      error: 'Username or email already registered',
    }
  }

  users.push({
    id: Date.now(),
    username,
    email,
    password,
    full_name,
    role: normalizeRole(role),
    student_class: student_class || '',
    is_active: true,
  })
  saveLocalUsers(users)
  saveProfileMeta(username, {
    role: normalizeRole(role),
    student_class: student_class || '',
    full_name,
  })

  return { success: true }
}

const loginLocalUser = (usernameOrEmail, password, expectedRole = 'student') => {
  const users = getLocalUsers()
  const user = users.find(
    (item) =>
      (item.username === usernameOrEmail || item.email === usernameOrEmail) &&
      item.password === password
  )

  if (!user) {
    return {
      success: false,
      error: 'Invalid username/email or password',
    }
  }

  if (expectedRole && normalizeRole(user.role) !== expectedRole) {
    return {
      success: false,
      error:
        expectedRole === 'teacher'
          ? 'Tài khoản này không phải tài khoản giáo viên'
          : 'Tài khoản này không phải tài khoản học sinh',
    }
  }

  const access_token = createLocalToken(user.username)
  localStorage.setItem('token', access_token)
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    role: normalizeRole(user.role),
    student_class: user.student_class || '',
    is_active: true,
  }
  localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(safeUser))

  return {
    success: true,
    access_token,
    user: safeUser,
  }
}

// Auth Store
export const useAuthStore = create((set, get) => ({
  user: getLocalCurrentUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (username, password, role = 'student') => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.login({ username, password })
      const { access_token, user } = response.data
      const userRole = normalizeRole(user.role)

      if (role && userRole !== role) {
        set({ isLoading: false })
        return {
          success: false,
          error:
            role === 'teacher'
              ? 'Tài khoản này không phải tài khoản giáo viên'
              : 'Tài khoản này không phải tài khoản học sinh',
        }
      }

      const profileMeta = getProfileForUser(user.username)
      const safeUser = {
        ...user,
        role: userRole,
        student_class: profileMeta.student_class || user.student_class || '',
      }
      localStorage.setItem('token', access_token)
      localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(safeUser))
      set({
        user: safeUser,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } catch (error) {
      const backendUnavailable =
        !error.response ||
        error.response.status === 404 ||
        error.response.status >= 500

      if (backendUnavailable || error.response?.status === 401 || error.response?.status === 422) {
        const result = loginLocalUser(username, password, role)
        if (result.success) {
          set({
            user: result.user,
            token: result.access_token,
            isAuthenticated: true,
            isLoading: false,
          })
          return { success: true }
        }

        set({ error: result.error, isLoading: false })
        return result
      }

      const message = error.response?.data?.detail || 'Login failed'
      set({
        error: message,
        isLoading: false,
      })
      return { success: false, error: message }
    }
  },

  register: async (username, email, password, full_name, role = 'student', student_class = '') => {
    set({ isLoading: true, error: null })
    try {
      await authAPI.register({
        username,
        email,
        password,
        full_name,
        role,
      })
      saveProfileMeta(username, { role, student_class, full_name })
      set({ isLoading: false })
      return { success: true }
    } catch (error) {
      const backendUnavailable =
        !error.response ||
        error.response.status === 404 ||
        error.response.status >= 500

      if (backendUnavailable) {
        const result = saveLocalRegistration({
          username,
          email,
          password,
          full_name,
          role,
          student_class,
        })
        set({ isLoading: false })
        return result
      }

      const message =
        error.response?.data?.detail ||
        'Registration failed'
      set({
        error: message,
        isLoading: false,
      })
      return { success: false, error: message }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem(LOCAL_CURRENT_USER_KEY)
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
