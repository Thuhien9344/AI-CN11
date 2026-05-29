import { sampleLessons } from '../data/courseCatalog'

const STORAGE_KEY = 'engine_lab_learning_events'
const DEDUPE_WINDOW_MS = 60 * 1000

const readEvents = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const writeEvents = (events) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export const recordLocalLearningEvent = (userId, event) => {
  if (!userId) return

  const events = readEvents()
  const now = Date.now()
  const lastSimilarEvent = [...events].reverse().find(
    (item) =>
      String(item.user_id) === String(userId) &&
      Number(item.lesson_id) === Number(event.lesson_id) &&
      item.event_type === event.event_type
  )

  if (
    lastSimilarEvent &&
    now - new Date(lastSimilarEvent.created_at).getTime() < DEDUPE_WINDOW_MS &&
    event.event_type !== 'assistant_question' &&
    event.event_type !== 'quiz_submitted' &&
    event.event_type !== 'game_played'
  ) {
    return
  }

  events.push({
    id: `${now}-${events.length}`,
    user_id: userId,
    lesson_id: event.lesson_id ? Number(event.lesson_id) : null,
    event_type: event.event_type,
    duration_seconds: event.duration_seconds || 0,
    score: event.score ?? null,
    payload: event.payload || null,
    created_at: new Date(now).toISOString(),
  })
  writeEvents(events.slice(-300))
}

const createEmptyProgress = (userId, lesson) => ({
  id: `${userId}-${lesson.id}`,
  user_id: userId,
  lesson_id: lesson.id,
  status: 'not_started',
  progress_percent: 0,
  view_count: 0,
  simulation_count: 0,
  assistant_question_count: 0,
  quiz_attempt_count: 0,
  game_count: 0,
  best_quiz_score: 0,
  average_quiz_score: 0,
  time_spent_seconds: 0,
  last_activity_type: null,
  last_accessed_at: new Date().toISOString(),
  completed_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  lesson,
})

const updateProgressFromEvent = (progress, event) => {
  progress.last_activity_type = event.event_type
  progress.last_accessed_at = event.created_at
  progress.updated_at = event.created_at
  progress.time_spent_seconds += event.duration_seconds || 0

  if (event.event_type === 'lesson_viewed') {
    progress.view_count += 1
    progress.progress_percent = Math.max(progress.progress_percent, 20)
  }

  if (event.event_type === 'simulation_opened') {
    progress.simulation_count += 1
    progress.progress_percent = Math.max(progress.progress_percent, 45)
  }

  if (event.event_type === 'assistant_question') {
    progress.assistant_question_count += 1
    progress.progress_percent = Math.max(progress.progress_percent, 60)
  }

  if (event.event_type === 'game_played') {
    progress.game_count += 1
    progress.progress_percent = Math.max(progress.progress_percent, 75)
  }

  if (event.event_type === 'lesson_completed') {
    progress.progress_percent = 100
  }

  if (event.event_type === 'quiz_submitted') {
    progress.quiz_attempt_count += 1
    const score = Number(event.score || 0)
    progress.best_quiz_score = Math.max(progress.best_quiz_score, score)
    const previousTotal = progress.average_quiz_score * (progress.quiz_attempt_count - 1)
    progress.average_quiz_score = Math.round((previousTotal + score) / progress.quiz_attempt_count)
    progress.progress_percent = Math.max(progress.progress_percent, score >= 70 ? 100 : 85)
  }

  if (progress.progress_percent >= 100) {
    progress.status = 'completed'
    progress.completed_at = progress.completed_at || event.created_at
  } else if (progress.quiz_attempt_count > 0 && progress.best_quiz_score < 60) {
    progress.status = 'needs_review'
  } else if (progress.progress_percent > 0) {
    progress.status = 'in_progress'
  }
}

const buildRecommendations = (progressRows) =>
  progressRows
    .filter((progress) => progress.status === 'needs_review' || (progress.progress_percent > 0 && progress.progress_percent < 80))
    .slice(0, 5)
    .map((progress) => ({
      lesson_id: progress.lesson_id,
      title: progress.lesson?.title || `Bài ${progress.lesson_id}`,
      reason:
        progress.status === 'needs_review'
          ? 'Điểm kiểm tra nhanh còn thấp, cần ôn lại.'
          : 'Bài học đã bắt đầu nhưng chưa hoàn thành đủ hoạt động.',
      priority: progress.status === 'needs_review' ? 'high' : 'medium',
      suggested_action:
        progress.status === 'needs_review'
          ? 'Đọc lại điểm cần nhớ, chơi game luyện tập và làm lại kiểm tra nhanh.'
          : 'Mở mô phỏng, hỏi trợ lý hoặc hoàn thành kiểm tra nhanh.',
    }))

export const buildLocalLearningDashboard = (userId) => {
  const userEvents = readEvents().filter((event) => String(event.user_id) === String(userId))
  const progressMap = new Map()

  sampleLessons.forEach((lesson) => {
    progressMap.set(lesson.id, createEmptyProgress(userId, lesson))
  })

  userEvents.forEach((event) => {
    if (!event.lesson_id || !progressMap.has(Number(event.lesson_id))) return
    updateProgressFromEvent(progressMap.get(Number(event.lesson_id)), event)
  })

  const lessonProgress = [...progressMap.values()]
  const activeProgress = lessonProgress.filter((item) => item.progress_percent > 0)
  const completedLessons = lessonProgress.filter((item) => item.status === 'completed').length
  const inProgressLessons = lessonProgress.filter((item) => item.status === 'in_progress' || item.status === 'needs_review').length
  const quizRows = lessonProgress.filter((item) => item.quiz_attempt_count > 0)

  return {
    user_id: userId,
    total_lessons: lessonProgress.length,
    completed_lessons: completedLessons,
    in_progress_lessons: inProgressLessons,
    average_progress: lessonProgress.length
      ? Math.round(lessonProgress.reduce((sum, item) => sum + item.progress_percent, 0) / lessonProgress.length)
      : 0,
    average_quiz_score: quizRows.length
      ? Math.round(quizRows.reduce((sum, item) => sum + item.best_quiz_score, 0) / quizRows.length)
      : 0,
    total_time_spent_seconds: activeProgress.reduce((sum, item) => sum + item.time_spent_seconds, 0),
    assistant_questions: activeProgress.reduce((sum, item) => sum + item.assistant_question_count, 0),
    recent_events: userEvents.slice(-10).reverse(),
    lesson_progress: lessonProgress,
    recommendations: buildRecommendations(lessonProgress),
    source: 'local',
  }
}
