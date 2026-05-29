import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getChapterAssessmentsByCourse, getSampleCourse } from '../data/courseCatalog'
import { useAuthStore } from '../store'
import { recordLocalLearningEvent } from '../utils/learningProgress'

export default function ChapterTests() {
  const { courseId } = useParams()
  const user = useAuthStore((state) => state.user)
  const course = getSampleCourse(courseId)
  const assessments = getChapterAssessmentsByCourse(courseId)
  const [activeId, setActiveId] = useState(assessments[0]?.id || '')
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const activeAssessment = useMemo(
    () => assessments.find((assessment) => assessment.id === activeId) || assessments[0],
    [assessments, activeId],
  )

  const handleSelectAssessment = (assessmentId) => {
    setActiveId(assessmentId)
    setAnswers({})
    setSubmitted(false)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (!activeAssessment) return

    const correctCount = activeAssessment.questions.filter(
      (question) => answers[question.id] === question.correctIndex,
    ).length

    recordLocalLearningEvent(user?.id, {
      lesson_id: Number(courseId),
      event_type: 'chapter_test_submitted',
      duration_seconds: activeAssessment.duration_minutes * 60,
      score: Math.round((correctCount / activeAssessment.questions.length) * 100),
      payload: {
        assessment_id: activeAssessment.id,
        correct_answers: correctCount,
        total_questions: activeAssessment.questions.length,
      },
    })
  }

  if (!course) {
    return (
      <div className="page-container">
        <div className="panel p-8 text-center text-slate-600">Không tìm thấy học phần.</div>
      </div>
    )
  }

  if (!activeAssessment) {
    return (
      <div className="page-container">
        <Link to={`/courses/${courseId}`} className="mb-5 inline-flex text-sm font-semibold text-blue-700">
          Quay lại học phần
        </Link>
        <div className="panel p-8 text-center text-slate-600">
          Học phần này chưa có bài kiểm tra theo chương.
        </div>
      </div>
    )
  }

  const correctCount = activeAssessment.questions.filter(
    (question) => answers[question.id] === question.correctIndex,
  ).length
  const scorePercent = Math.round((correctCount / activeAssessment.questions.length) * 100)

  return (
    <div className="page-container">
      <Link to={`/courses/${courseId}`} className="mb-5 inline-flex text-sm font-semibold text-blue-700">
        Quay lại học phần
      </Link>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="muted-label mb-2">Không gian đánh giá</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Bài kiểm tra theo chương</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          {course.title}. Giáo viên có thể dùng khu vực này để giao bài ôn tập sau từng chương, học sinh làm
          trực tiếp và xem giải thích ngay sau khi nộp.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-3">
          {assessments.map((assessment) => (
            <button
              key={assessment.id}
              type="button"
              onClick={() => handleSelectAssessment(assessment.id)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                activeAssessment.id === assessment.id
                  ? 'border-blue-500 bg-blue-50 text-blue-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
              }`}
            >
              <div className="text-sm font-bold">{assessment.chapter}</div>
              <div className="mt-1 font-semibold">{assessment.title}</div>
              <div className="mt-2 text-xs text-slate-500">{assessment.duration_minutes} phút</div>
            </button>
          ))}
        </aside>

        <main className="panel p-6">
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row">
            <div>
              <p className="muted-label mb-1">{activeAssessment.chapter}</p>
              <h2 className="text-2xl font-bold text-slate-950">{activeAssessment.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{activeAssessment.description}</p>
            </div>
            <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              {activeAssessment.questions.length} câu hỏi
            </div>
          </div>

          <div className="space-y-5">
            {activeAssessment.questions.map((question, questionIndex) => (
              <div key={question.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold leading-7 text-slate-950">
                  Câu {questionIndex + 1}. {question.text}
                </h3>
                <div className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[question.id] === optionIndex
                    const isCorrect = submitted && question.correctIndex === optionIndex
                    const isWrong = submitted && isSelected && question.correctIndex !== optionIndex

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          !submitted &&
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: optionIndex,
                          }))
                        }
                        className={`flex w-full items-start gap-3 rounded-md border bg-white p-3 text-left text-sm transition ${
                          isCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                            : isWrong
                              ? 'border-red-300 bg-red-50 text-red-900'
                              : isSelected
                                ? 'border-blue-400 bg-blue-50 text-blue-950'
                                : 'border-slate-200 text-slate-700 hover:border-blue-200'
                        }`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option}</span>
                      </button>
                    )
                  })}
                </div>
                {submitted && (
                  <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-slate-700">
                    {question.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            {submitted ? (
              <div>
                <div className="text-lg font-bold text-slate-950">Kết quả: {scorePercent}%</div>
                <div className="text-sm text-slate-600">
                  Đúng {correctCount}/{activeAssessment.questions.length} câu.
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                Đã chọn {Object.keys(answers).length}/{activeAssessment.questions.length} câu.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                }}
                className="secondary-button"
              >
                Làm lại
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < activeAssessment.questions.length}
                className="primary-button disabled:cursor-not-allowed disabled:opacity-50"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
