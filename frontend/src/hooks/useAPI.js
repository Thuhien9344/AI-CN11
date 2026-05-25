import { useAuthStore, useCoursesStore, useLessonsStore } from '../store'
import { coursesAPI, lessonsAPI } from '../services/api'

export const useAuth = () => {
  const store = useAuthStore()
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
  }
}

export const useCourses = () => {
  const store = useCoursesStore()

  const fetchCourses = async (skip = 0, limit = 10) => {
    try {
      const response = await coursesAPI.list(skip, limit)
      store.courses = response.data
      store.isLoading = false
    } catch (error) {
      store.error = error.message
      store.isLoading = false
    }
  }

  return {
    courses: store.courses,
    isLoading: store.isLoading,
    error: store.error,
    fetchCourses,
  }
}

export const useLessons = () => {
  const store = useLessonsStore()

  const fetchLessons = async (courseId) => {
    try {
      const response = await lessonsAPI.list(courseId)
      store.lessons = response.data
      store.isLoading = false
    } catch (error) {
      store.error = error.message
      store.isLoading = false
    }
  }

  const fetchLesson = async (lessonId) => {
    try {
      const response = await lessonsAPI.get(lessonId)
      store.currentLesson = response.data
    } catch (error) {
      store.error = error.message
    }
  }

  return {
    lessons: store.lessons,
    currentLesson: store.currentLesson,
    isLoading: store.isLoading,
    error: store.error,
    fetchLessons,
    fetchLesson,
    setCurrentLesson: store.setCurrentLesson,
  }
}
