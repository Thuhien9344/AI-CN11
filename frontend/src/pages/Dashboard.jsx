import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { sampleCourses, getSampleLessonsByCourse } from '../data/courseCatalog'
import { useAuthStore } from '../store'

const toolStyles = [
  'from-sky-500 to-cyan-400',
  'from-orange-500 to-amber-400',
  'from-violet-500 to-fuchsia-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-pink-400',
]

const mechanicalIcons = ['⚙', '🔩', '🛠', '🚗', '🔧', '⛓']

const learningTools = [
  {
    title: 'Lớp học Công nghệ',
    description: 'Thông báo, nhiệm vụ thực hành, bài nộp và phản hồi của giáo viên.',
    to: '/classroom',
    label: 'Vào lớp học',
    icon: '🏫',
    guide: [
      'Đọc thông báo mới của giáo viên ở bảng tin lớp.',
      'Chọn nhiệm vụ đang mở để xem yêu cầu và hạn nộp.',
      'Nộp bài hoặc theo dõi trạng thái nộp bài theo lớp nếu là giáo viên.',
    ],
  },
  {
    title: 'Tài liệu theo chương',
    description: 'Slide, PDF, phiếu học tập và tài liệu tham khảo gắn với từng chương học.',
    to: '/courses/1',
    label: 'Chọn chương',
    icon: '📚',
    guide: [
      'Vào một chương bất kỳ trong lộ trình học.',
      'Mở khối Tài liệu theo chương ở cạnh phải trang.',
      'Giáo viên có thể tải tài liệu lên, học sinh tải xuống để học và làm nhiệm vụ.',
    ],
  },
  {
    title: 'Hoạt động luyện tập',
    description: 'Game kiến thức, thiết kế sơ đồ và hướng dẫn thao tác cho từng hoạt động.',
    to: '/games',
    label: 'Luyện tập',
    icon: '🎮',
    guide: [
      'Chọn chương hoặc hoạt động Thiết kế sơ đồ kiến thức.',
      'Đọc khung Hướng dẫn hoạt động trước khi bắt đầu.',
      'Hoàn thành lượt luyện tập để nhận XP hoặc lưu sơ đồ đã thiết kế.',
    ],
  },
  {
    title: 'Cuộc thi vui',
    description: 'Các thử thách vui về cơ khí, sơ đồ hệ thống và động cơ để học sinh thi đua.',
    to: '/contests',
    label: 'Vào cuộc thi',
    icon: '🏆',
    guide: [
      'Chọn một cuộc thi phù hợp với nội dung đang học.',
      'Đọc hướng dẫn trước khi bắt đầu để biết cách tính hoạt động.',
      'Vào luyện tập hoặc kho đề để hoàn thành thử thách.',
    ],
  },
  {
    title: 'Kho đề luyện tập Công nghệ',
    description: 'Tổng hợp đề theo chương, có thời lượng, câu hỏi và phần giải thích sau khi nộp.',
    to: '/practice-bank',
    label: 'Mở kho đề',
    icon: '📝',
    guide: [
      'Chọn đề theo chương hoặc chủ đề muốn ôn.',
      'Làm đủ câu hỏi rồi nộp để xem kết quả.',
      'Đọc giải thích và quay lại chương tương ứng để ôn phần còn yếu.',
    ],
  },
  {
    title: 'Theo dõi tiến độ cá nhân',
    description: 'Theo dõi tiến độ, XP, huy hiệu, quiz và gợi ý học tập cá nhân hóa.',
    to: '/progress',
    label: 'Xem tiến độ',
    icon: '📈',
    guide: [
      'Xem phần trăm hoàn thành, điểm quiz và thời gian học.',
      'Kiểm tra bài cần ôn lại hoặc bài được AI gợi ý tiếp theo.',
      'Theo dõi XP, huy hiệu và hoạt động gần đây của tài khoản.',
    ],
  },
]

const toolColorClasses = [
  'border-sky-200 bg-sky-50',
  'border-amber-200 bg-amber-50',
  'border-violet-200 bg-violet-50',
  'border-emerald-200 bg-emerald-50',
  'border-rose-200 bg-rose-50',
  'border-blue-200 bg-blue-50',
  'border-cyan-200 bg-cyan-50',
]

const audienceCards = [
  { title: 'Học sinh', icon: '🎒', color: 'bg-white text-indigo-600' },
  { title: 'Giáo viên', icon: '🧑‍🏫', color: 'bg-white text-orange-600' },
  { title: 'Phòng thực hành', icon: '🛠', color: 'bg-white text-emerald-600' },
  { title: 'Nova 3D', icon: '⚙', color: 'bg-white text-violet-600' },
]

const subjectFocus = [
  'Cơ khí chế tạo',
  'Vật liệu cơ khí',
  'Gia công và an toàn',
  'Động cơ đốt trong',
  'Khái quát ô tô',
]

const studyWorkflow = [
  'Đọc mục tiêu và kiến thức trọng tâm của bài học.',
  'Quan sát Nova 3D hoặc sơ đồ để hiểu cấu tạo và nguyên lí.',
  'Làm hoạt động tương tác, game luyện tập và quiz theo chương.',
  'Nộp nhiệm vụ, xem phản hồi và cập nhật hồ sơ năng lực.',
]

const readLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('local_auth_users') || '[]')
  } catch {
    return []
  }
}

const readLocalEvents = () => {
  try {
    return JSON.parse(localStorage.getItem('engine_lab_learning_events') || '[]')
  } catch {
    return []
  }
}

function TeacherOverview({ totalLessons }) {
  const users = readLocalUsers()
  const events = readLocalEvents()
  const students = users.filter((item) => item.role === 'student')
  const completedEvents = events.filter((item) => item.event_type === 'lesson_completed')
  const quizEvents = events.filter((item) => item.event_type === 'quiz_submitted')
  const simulationEvents = events.filter((item) => item.event_type === 'simulation_opened')
  const assistantEvents = events.filter((item) => item.event_type === 'assistant_question')
  const averageQuiz = quizEvents.length
    ? Math.round(quizEvents.reduce((sum, item) => sum + Number(item.score || 0), 0) / quizEvents.length)
    : 0
  const classStats = students.reduce((rows, student) => {
    const className = student.student_class || 'Chưa có lớp'
    rows[className] = rows[className] || { className, total: 0 }
    rows[className].total += 1
    return rows
  }, {})

  const cards = [
    { label: 'Học sinh', value: students.length, tone: 'text-indigo-700', icon: '👥' },
    { label: 'Hoàn thành bài', value: completedEvents.length, tone: 'text-emerald-700', icon: '✅' },
    { label: 'Lượt quiz', value: quizEvents.length, tone: 'text-amber-700', icon: '📝' },
    { label: 'Điểm quiz TB', value: `${averageQuiz}%`, tone: 'text-rose-700', icon: '📊' },
  ]

  return (
    <section className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-6 shadow-lg">
      <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Dashboard giáo viên</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Tổng quan quản lý lớp học</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Theo dõi nhanh học sinh, quiz, mô phỏng, hỏi AI và mức hoàn thành để hỗ trợ lớp học thật.
          </p>
        </div>
        <Link to="/classroom" className="primary-button">Quản lý lớp học</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="motion-card rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{card.icon}</span>
              <span className={`text-3xl font-black ${card.tone}`}>{card.value}</span>
            </div>
            <p className="mt-3 text-sm font-black uppercase text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="font-black text-slate-950">Hoạt động học tập</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-sky-50 p-3 font-bold text-sky-900">Mô phỏng: {simulationEvents.length}</div>
            <div className="rounded-xl bg-violet-50 p-3 font-bold text-violet-900">Câu hỏi AI: {assistantEvents.length}</div>
            <div className="rounded-xl bg-emerald-50 p-3 font-bold text-emerald-900">Bài hoàn thành: {completedEvents.length}/{Math.max(1, students.length * totalLessons)}</div>
            <div className="rounded-xl bg-amber-50 p-3 font-bold text-amber-900">Quiz đã làm: {quizEvents.length}</div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="font-black text-slate-950">Sĩ số theo lớp</h3>
          <div className="mt-4 space-y-2">
            {Object.values(classStats).length ? (
              Object.values(classStats).map((row) => (
                <div key={row.className} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                  <span>Lớp {row.className}</span>
                  <span>{row.total} học sinh</span>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Chưa có tài khoản học sinh local để thống kê.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeToolIndex, setActiveToolIndex] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setCourses(sampleCourses)
    setIsLoading(false)
  }, [])

  const courseSummaries = useMemo(
    () =>
      courses.map((course, index) => {
        const lessons = getSampleLessonsByCourse(course.id)
        return {
          ...course,
          index: index + 1,
          lessons,
          lessonCount: lessons.length,
          accent: toolStyles[index % toolStyles.length],
        }
      }),
    [courses]
  )

  const totalLessons = courseSummaries.reduce((total, course) => total + course.lessonCount, 0)
  const learnerName = user?.full_name || user?.username || 'học sinh'
  const activeTool = learningTools[activeToolIndex]
  const isTeacher = user?.role === 'teacher'

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="panel px-6 py-4 text-slate-600">Đang tải phòng học Công nghệ...</div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-indigo-600 pb-16 pt-10 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="motion-float absolute left-24 top-12 h-24 w-24 rounded-3xl border border-white" />
          <div className="motion-float absolute right-32 top-20 h-36 w-36 rounded-full border border-white" />
          <div className="absolute bottom-10 left-1/4 h-20 w-20 rounded-3xl bg-white/20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="motion-pulse-soft flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl">
                👤
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-black">{learnerName}</p>
                <p className="truncate text-sm font-bold text-indigo-100">{user?.email || user?.username || 'EngineLab learner'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/courses/1" className="rounded-xl bg-white px-5 py-3 text-sm font-black text-orange-600 shadow-lg transition hover:-translate-y-0.5">
                Vào học ngay
              </Link>
              <Link to="/progress" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600">
                Xem tiến độ
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-4 grid max-w-5xl overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl md:grid-cols-3">
            <Link to="/classroom" className="flex items-center justify-center gap-2 px-5 py-4 text-sm font-black transition hover:bg-indigo-50">
              🏫 Lớp học chung
            </Link>
            <Link to="/progress" className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4 text-sm font-black transition hover:bg-indigo-50 md:border-l md:border-t-0">
              🪪 Trang cá nhân
            </Link>
            <Link to="/games" className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4 text-sm font-black transition hover:bg-indigo-50 md:border-l md:border-t-0">
              🎮 Hoạt động luyện tập
            </Link>
          </div>
        </div>
      </section>

      <main className="page-container">
        {isTeacher && <TeacherOverview totalLessons={totalLessons} />}

        <section className="motion-shimmer -mt-14 mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-400 p-5 text-white shadow-2xl">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_360px]">
            <div className="p-3 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-3">
                {mechanicalIcons.slice(0, 4).map((icon, index) => (
                  <span
                    key={icon}
                    className={`motion-float inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-lg backdrop-blur ${
                      index % 2 ? 'motion-pulse-soft' : ''
                    }`}
                  >
                    {icon}
                  </span>
                ))}
              </div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-200">EngineLab 2026</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                Học Công nghệ vui hơn với mô phỏng và luyện tập
              </h1>
              <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-sky-50">
                Cơ khí, động cơ đốt trong, ô tô, sơ đồ hệ thống và bài nộp lớp học trong một không gian học tập trực quan.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/courses/1" className="rounded-xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5">
                  Bắt đầu học
                </Link>
                <Link to="/games" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5">
                  Luyện tập ngay
                </Link>
              </div>
            </div>
            <div className="relative min-h-[250px]">
              <div className="motion-float absolute right-8 top-4 text-8xl">🚗</div>
              <div className="motion-spin-slow absolute right-28 top-28 text-6xl">⚙</div>
              <div className="motion-swing absolute bottom-24 left-28 text-5xl">🔧</div>
              <div className="motion-float absolute left-8 top-16 rounded-3xl bg-yellow-300 px-6 py-4 text-center text-blue-900 shadow-xl">
                <p className="text-5xl font-black">{courses.length}</p>
                <p className="text-sm font-black">chương</p>
              </div>
              <div className="absolute bottom-4 right-8 rounded-3xl bg-white px-6 py-5 text-blue-700 shadow-xl">
                <p className="text-4xl font-black">{totalLessons}+</p>
                <p className="text-sm font-black">hoạt động</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Hướng dẫn nhanh</p>
            <div className="mt-3 grid gap-3 text-base leading-7 text-indigo-950 sm:grid-cols-3">
              <p><span className="font-black">Bước 1:</span> Chọn chương và đọc bài học.</p>
              <p><span className="font-black">Bước 2:</span> Mở mô phỏng, sơ đồ hoặc game để luyện.</p>
              <p><span className="font-black">Bước 3:</span> Làm quiz, nộp nhiệm vụ và xem tiến độ.</p>
            </div>
          </div>
          <Link
            to="/lessons/402/chat"
            className="rounded-2xl border border-violet-200 bg-violet-600 p-5 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <p className="text-xs font-black uppercase tracking-wide text-violet-100">AI học tập nổi bật</p>
            <h2 className="mt-2 text-2xl font-black">Hỏi AI đúng trọng tâm bài học</h2>
            <p className="mt-2 text-base leading-7 text-violet-50">
              Hỏi về động cơ, lỗi sai, nguyên lí làm việc, bộ phận và cách ghi nhớ kiến thức.
            </p>
          </Link>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {learningTools.map((tool, index) => (
            <button
              key={tool.title}
              type="button"
              onClick={() => setActiveToolIndex(index)}
              className={`motion-card group overflow-hidden rounded-2xl border text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                activeToolIndex === index ? 'ring-4 ring-indigo-100' : ''
              } ${toolColorClasses[index]}`}
            >
              <div className={`h-2 bg-gradient-to-r ${toolStyles[index]}`} />
              <div className="p-5">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-black text-white ${toolStyles[index]}`}>
                  {tool.icon}
                </div>
                <span className="motion-spin-slow float-right text-2xl text-slate-300">{mechanicalIcons[index % mechanicalIcons.length]}</span>
                <p className="text-lg font-black text-slate-950">{tool.title}</p>
                <p className="mt-3 min-h-[92px] text-base leading-7 text-slate-700">{tool.description}</p>
                <div className="mt-5 text-sm font-black text-indigo-600 group-hover:text-orange-600">Xem hướng dẫn →</div>
              </div>
            </button>
          ))}
        </section>

        <section className="motion-pop mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-amber-50 p-5 shadow-lg">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Hướng dẫn sử dụng từng mục</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{activeTool.icon} {activeTool.title}</h2>
              <div className="mt-3 flex gap-2">
                {mechanicalIcons.slice(0, 3).map((icon) => (
                  <span key={icon} className="motion-swing inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    {icon}
                  </span>
                ))}
              </div>
              <ol className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 md:grid-cols-3">
                {activeTool.guide.map((step, index) => (
                  <li key={step} className="rounded-xl bg-white p-3 shadow-sm">
                    <span className="font-black text-indigo-700">Bước {index + 1}:</span> {step}
                  </li>
                ))}
              </ol>
            </div>
            <Link to={activeTool.to} className="primary-button shrink-0">
              {activeTool.label}
            </Link>
          </div>
        </section>

        <section className="mb-8 rounded-3xl bg-gradient-to-r from-amber-50 via-sky-50 to-violet-50 p-5">
          <div className="grid gap-3 sm:grid-cols-5">
            {subjectFocus.map((item, index) => (
              <div key={item} className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-black text-slate-800 shadow-sm">
                <span className={`mx-auto mb-3 block h-3 w-12 rounded-full bg-gradient-to-r ${toolStyles[index]}`} />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="muted-label text-indigo-600">Lộ trình Công nghệ THPT</p>
              <h2 className="section-title mt-1">Các chương học theo mạch kiến thức</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Mỗi chương là một học phần riêng, có bài học, mô phỏng, hoạt động luyện tập, kiểm tra chương và nhiệm vụ
              tương ứng.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {courseSummaries.map((course) => {
              const firstLesson = course.lessons[0]

              return (
                <article key={course.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md">
                  <div className={`h-2 bg-gradient-to-r ${course.accent}`} />
                  <div className="flex gap-4 p-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-black text-white ${course.accent}`}>
                      <span className="motion-spin-slow">{mechanicalIcons[(course.index - 1) % mechanicalIcons.length]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                          {course.lessonCount} bài học
                        </span>
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                          Có kiểm tra chương
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-black text-slate-950">{course.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{course.description}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-slate-600">
                        Bắt đầu: <span className="font-black text-slate-900">{firstLesson?.title}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/courses/${course.id}`} className="secondary-button">Vào chương</Link>
                        <Link to={`/courses/${course.id}/chapter-tests`} className="primary-button">Kiểm tra</Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="mb-5 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-wide text-orange-300">Quy trình học</p>
            <h2 className="mt-2 text-2xl font-black">Từ hiểu cấu tạo đến giải thích nguyên lí</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studyWorkflow.map((item, index) => (
              <div key={item} className="rounded-2xl bg-white/10 p-4">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white ${toolStyles[index]}`}>
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
