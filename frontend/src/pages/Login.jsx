import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store'

const accountTypes = [
  {
    value: 'student',
    title: 'Học sinh THPT',
    badge: 'Học bài - luyện tập - nộp nhiệm vụ',
    description: 'Theo dõi lộ trình Công nghệ, làm quiz, xem học liệu, nộp nhiệm vụ và xem hồ sơ năng lực.',
  },
  {
    value: 'teacher',
    title: 'Giáo viên Công nghệ',
    badge: 'Quản lý lớp - học liệu - đánh giá',
    description: 'Tổ chức bài học, giao nhiệm vụ, tải học liệu và theo dõi tiến độ học tập của lớp.',
  },
]

const highlights = [
  'Thiết kế riêng cho môn Công nghệ THPT',
  'Trọng tâm cơ khí, động cơ đốt trong và ô tô',
  'Kết hợp mô phỏng, sơ đồ, quiz và đánh giá',
]

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: location.state?.username || '',
    password: '',
    role: location.state?.role || 'student',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const chooseRole = (role) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await login(formData.username, formData.password, formData.role)

    if (result.success) {
      toast.success('Đăng nhập thành công')
      navigate(formData.role === 'teacher' ? '/classroom' : '/')
    } else {
      toast.error(result.error || error || 'Đăng nhập thất bại')
    }
  }

  const activeRole = accountTypes.find((item) => item.value === formData.role)

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="auth-light-panel bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 p-7 text-slate-950 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">EngineLab Công nghệ</p>
          <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            Phòng học Công nghệ THPT
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-700">
            Không gian học tập chuyên biệt cho môn Công nghệ: học lí thuyết, quan sát mô phỏng, thiết kế sơ đồ hệ
            thống, luyện tập và nhận phản hồi theo từng chương.
          </p>

          <div className="mt-8 grid gap-3">
            {highlights.map((item) => (
              <div key={item} className="rounded-lg border border-sky-100 bg-white/80 px-4 py-3 text-sm font-bold text-slate-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </aside>

        <section className="p-6 sm:p-9">
          <p className="muted-label">Đăng nhập tài khoản</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{activeRole.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{activeRole.badge}</p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {accountTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => chooseRole(type.value)}
                className={`rounded-lg border p-4 text-left transition ${
                  formData.role === type.value
                    ? 'border-sky-300 bg-gradient-to-br from-sky-50 to-cyan-50 text-slate-950 shadow-md ring-2 ring-sky-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black">{type.title}</span>
                  <span className={`h-3 w-3 rounded-full ${formData.role === type.value ? 'bg-sky-500' : 'bg-slate-300'}`} />
                </div>
                <p className={`mt-2 text-sm leading-6 ${formData.role === type.value ? 'text-slate-700' : 'text-slate-600'}`}>
                  {type.description}
                </p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Tên đăng nhập hoặc email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="field-control"
                placeholder="Nhập tên đăng nhập hoặc email"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="field-control pr-12"
                  placeholder="Nhap mat khau"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 my-auto flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label={showPassword ? 'An mat khau' : 'Hien mat khau'}
                  title={showPassword ? 'An mat khau' : 'Hien mat khau'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c6 0 9 8 9 8a15.4 15.4 0 0 1-2.1 3.4" />
                      <path d="M6.6 6.6C4.2 8.2 3 12 3 12s3 8 9 8a10.7 10.7 0 0 0 5.4-1.6" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="primary-button w-full py-3">
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-black text-blue-700 hover:text-blue-800">
              Tạo tài khoản mới
            </Link>
          </p>
        </section>
      </section>
    </main>
  )
}


