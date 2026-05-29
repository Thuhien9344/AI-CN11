import { useState } from 'react'
import { Link } from 'react-router-dom'

const contests = [
  {
    id: 'speed-mechanic',
    title: 'Thợ máy tốc độ',
    icon: '⚙',
    color: 'from-sky-500 to-cyan-400',
    time: '10 phút',
    description: 'Trả lời nhanh các câu hỏi về cấu tạo, nhiệm vụ và nguyên lí cơ khí.',
    prize: 'Huy hiệu Tốc độ cơ khí',
    route: '/games',
    demoQuestion: {
      text: 'Bộ phận nào biến chuyển động tịnh tiến của piston thành chuyển động quay?',
      options: ['Trục khuỷu', 'Két nước', 'Bugi', 'Lọc gió'],
      answer: 'Trục khuỷu',
    },
    guide: [
      'Chọn chương muốn thi trong khu Luyện tập.',
      'Trả lời liên tục, ưu tiên đọc kĩ câu hỏi trước khi chọn đáp án.',
      'Sau khi hoàn thành, xem giải thích để sửa lỗi và tăng điểm lần sau.',
    ],
  },
  {
    id: 'diagram-race',
    title: 'Đua sơ đồ hệ thống',
    icon: '🔧',
    color: 'from-violet-500 to-fuchsia-400',
    time: '15 phút',
    description: 'Thiết kế sơ đồ cấu tạo hoặc quy trình đúng, đủ khối và có mũi tên liên kết.',
    prize: 'Huy hiệu Kiến trúc sư hệ thống',
    route: '/design-lab',
    demoQuestion: {
      text: 'Một sơ đồ hệ thống tốt cần có yếu tố nào?',
      options: ['Khối kiến thức chính', 'Mũi tên liên kết', 'Ghi chú nhiệm vụ', 'Cả ba ý trên'],
      answer: 'Cả ba ý trên',
    },
    guide: [
      'Mở hoạt động Thiết kế sơ đồ trong trang Luyện tập.',
      'Thêm các khối cơ khí chính, kéo thả theo trình tự hợp lí.',
      'Nối mũi tên, ghi chú nhiệm vụ của từng khối và lưu sơ đồ.',
    ],
  },
  {
    id: 'engine-master',
    title: 'Chuyên gia động cơ',
    icon: '🚗',
    color: 'from-orange-500 to-amber-400',
    time: '12 phút',
    description: 'Thử thách kiến thức về động cơ đốt trong, ô tô và hệ thống truyền lực.',
    prize: 'Huy hiệu Chuyên gia động cơ',
    route: '/practice-bank',
    demoQuestion: {
      text: 'Kì nào trong chu trình động cơ 4 kì là kì sinh công?',
      options: ['Kì nạp', 'Kì nén', 'Kì cháy - giãn nở', 'Kì thải'],
      answer: 'Kì cháy - giãn nở',
    },
    guide: [
      'Ôn lại bài học về động cơ, ô tô hoặc hệ thống liên quan.',
      'Làm bài kiểm tra chương để đo mức hiểu kiến thức.',
      'Quay lại phần yếu trong Theo dõi tiến độ cá nhân để ôn sâu hơn.',
    ],
  },
]

const leaderboard = [
  { rank: 1, name: 'Minh Anh', className: '11A1', score: 980, badge: '⚙' },
  { rank: 2, name: 'Tuấn Kiệt', className: '11A2', score: 910, badge: '🔧' },
  { rank: 3, name: 'Hà Linh', className: '11A1', score: 875, badge: '🚗' },
  { rank: 4, name: 'Đức Huy', className: '11A3', score: 820, badge: '🛠' },
]

const rules = [
  'Mỗi lượt thi có thời gian giới hạn, ưu tiên trả lời đúng trước rồi mới tối ưu tốc độ.',
  'Điểm gồm câu đúng, chuỗi trả lời đúng và hoàn thành đủ yêu cầu của hoạt động.',
  'Sau khi thi, học sinh đọc giải thích hoặc xem lại sơ đồ để tự sửa lỗi kiến thức.',
]

export default function FunContests() {
  const [activeContest, setActiveContest] = useState(contests[0])

  return (
    <div className="page-container">
      <section className="motion-shimmer mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 p-6 text-white shadow-2xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-200">EngineLab challenge</p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Cuộc thi vui Công nghệ</h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-indigo-50">
              Chọn một thử thách, đọc hướng dẫn và bắt đầu luyện tập bằng game, sơ đồ hoặc bài kiểm tra chương.
            </p>
          </div>
          <div className="relative min-h-40">
            <span className="motion-spin-slow absolute right-20 top-2 text-7xl">⚙</span>
            <span className="motion-swing absolute bottom-2 left-12 text-6xl">🔧</span>
            <span className="motion-float absolute bottom-8 right-4 text-6xl">🏆</span>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        {contests.map((contest) => (
          <button
            key={contest.id}
            type="button"
            onClick={() => setActiveContest(contest)}
            className={`motion-card rounded-2xl border bg-white p-5 text-left shadow-lg ${
              activeContest.id === contest.id ? 'border-indigo-400 ring-4 ring-indigo-100' : 'border-slate-200'
            }`}
          >
            <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${contest.color} text-3xl text-white shadow-md`}>
              {contest.icon}
            </div>
            <h2 className="text-xl font-black text-slate-950">{contest.title}</h2>
            <p className="mt-2 text-sm font-bold text-indigo-600">{contest.time}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{contest.description}</p>
          </button>
        ))}
      </section>

      <section className="motion-pop rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-amber-50 p-6 shadow-lg">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Hướng dẫn sử dụng</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {activeContest.icon} {activeContest.title}
            </h2>
            <ol className="mt-4 grid gap-3 md:grid-cols-3">
              {activeContest.guide.map((step, index) => (
                <li key={step} className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
                  <span className="font-black text-indigo-700">Bước {index + 1}:</span> {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to={activeContest.route} className="primary-button">Bắt đầu thử thách</Link>
            <Link to="/practice-bank" className="secondary-button">Mở kho đề</Link>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <section className="panel p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="muted-label text-indigo-600">Mô phỏng nội dung cuộc thi</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">{activeContest.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Phần này là nội dung demo để học sinh hiểu trước dạng thử thách trước khi vào làm thật.
                </p>
              </div>
              <div className={`motion-pulse-soft rounded-2xl bg-gradient-to-br ${activeContest.color} px-5 py-4 text-white shadow-lg`}>
                <p className="text-xs font-black uppercase">Phần thưởng</p>
                <p className="mt-1 font-black">{activeContest.prize}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <span className="motion-spin-slow text-4xl">{activeContest.icon}</span>
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">Câu hỏi demo</p>
                  <h3 className="text-lg font-black text-slate-950">{activeContest.demoQuestion.text}</h3>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {activeContest.demoQuestion.options.map((option) => (
                  <div
                    key={option}
                    className={`rounded-xl border p-4 text-sm font-bold ${
                      option === activeContest.demoQuestion.answer
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">
                <span className="font-black text-emerald-700">Đáp án mẫu:</span> {activeContest.demoQuestion.answer}. Khi làm thật,
                hệ thống sẽ hiển thị giải thích sau khi nộp hoặc sau mỗi câu tùy chế độ luyện tập.
              </p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {rules.map((rule, index) => (
              <div key={rule} className="motion-card rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm">
                <p className="text-sm font-black uppercase">Thể lệ {index + 1}</p>
                <p className="mt-2 text-sm font-bold leading-6">{rule}</p>
              </div>
            ))}
          </section>
        </main>

        <aside className="space-y-6">
          <section className="panel p-5">
            <h2 className="text-xl font-black text-slate-950">Bảng xếp hạng demo</h2>
            <div className="mt-4 space-y-3">
              {leaderboard.map((row) => (
                <div key={row.rank} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">{row.badge}</span>
                    <div>
                      <p className="font-black text-slate-950">{row.rank}. {row.name}</p>
                      <p className="text-xs font-bold text-slate-500">Lớp {row.className}</p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-indigo-100 px-3 py-1 text-sm font-black text-indigo-700">{row.score}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950 shadow-sm">
            <h2 className="font-black">Gợi ý tổ chức trên lớp</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6">
              <li>Chia lớp thành nhóm 3-5 học sinh.</li>
              <li>Mỗi nhóm chọn một thử thách và cử đại diện thao tác.</li>
              <li>Giáo viên dùng điểm demo hoặc kết quả luyện tập để nhận xét nhanh.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
