import { Link } from 'react-router-dom'
import { chapterAssessments, sampleCourses } from '../data/courseCatalog'

const getCourse = (courseId) => sampleCourses.find((course) => course.id === Number(courseId))

export default function PracticeBank() {
  return (
    <div className="page-container">
      <section className="motion-shimmer mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 p-6 text-white shadow-2xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-100">Kho đề EngineLab</p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Kho đề luyện tập Công nghệ</h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-cyan-50">
              Tổng hợp đề theo chương để học sinh luyện trước khi kiểm tra, có câu hỏi, đáp án và giải thích sau khi nộp.
            </p>
          </div>
          <div className="relative min-h-40">
            <span className="motion-spin-slow absolute right-24 top-2 text-7xl">⚙</span>
            <span className="motion-float absolute bottom-4 right-4 text-6xl">📚</span>
            <span className="motion-swing absolute bottom-8 left-12 text-6xl">🛠</span>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="motion-card rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950 shadow-sm">
          <p className="text-sm font-black uppercase">Bước 1</p>
          <p className="mt-2 font-bold">Chọn chương hoặc đề muốn luyện.</p>
        </div>
        <div className="motion-card rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm">
          <p className="text-sm font-black uppercase">Bước 2</p>
          <p className="mt-2 font-bold">Làm đủ câu hỏi và nộp bài để xem điểm.</p>
        </div>
        <div className="motion-card rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-sm">
          <p className="text-sm font-black uppercase">Bước 3</p>
          <p className="mt-2 font-bold">Đọc giải thích, quay lại bài yếu để ôn.</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {chapterAssessments.map((assessment, index) => {
          const course = getCourse(assessment.course_id)
          return (
            <article key={assessment.id} className="motion-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400" />
              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                    Đề {index + 1}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    {assessment.questions.length} câu
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                    {assessment.duration_minutes} phút
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-950">{assessment.title}</h2>
                <p className="mt-2 text-sm font-bold text-indigo-700">{course?.title || assessment.chapter}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{assessment.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to={`/courses/${assessment.course_id}/chapter-tests`} className="primary-button">
                    Làm đề
                  </Link>
                  <Link to={`/courses/${assessment.course_id}`} className="secondary-button">
                    Ôn chương
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
