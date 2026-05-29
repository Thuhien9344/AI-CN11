import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store'

const roles = [
  {
    value: 'student',
    title: 'Học sinh THPT',
    subtitle: 'Nhập đầy đủ họ tên và lớp',
    note: 'Dùng để học bài, luyện tập, nộp nhiệm vụ và xem hồ sơ năng lực môn Công nghệ.',
  },
  {
    value: 'teacher',
    title: 'Giáo viên Công nghệ',
    subtitle: 'Quản lý học liệu và lớp học',
    note: 'Dùng để tải tài liệu, giao nhiệm vụ, tổ chức hoạt động và theo dõi tiến độ học sinh.',
  },
]

const expectations = [
  'Học sinh được gắn họ tên và lớp khi nộp bài.',
  'Giáo viên có không gian quản lý học liệu và nhiệm vụ.',
  'Dữ liệu dùng cho dashboard năng lực môn Công nghệ.',
]

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    student_class: '',
    role: 'student',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const chooseRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      student_class: role === 'teacher' ? '' : prev.student_class,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formData.role === 'student' && !formData.full_name.trim()) {
      toast.error('Học sinh cần nhập đầy đủ họ và tên')
      return
    }

    if (formData.role === 'student' && !formData.student_class.trim()) {
      toast.error('Học sinh cần nhập lớp')
      return
    }

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.full_name,
      formData.role,
      formData.student_class
    )

    if (result.success) {
      toast.success('Tạo tài khoản thành công. Bạn có thể đăng nhập.')
      navigate('/login')
    } else {
      toast.error(result.error || error || 'Tạo tài khoản thất bại')
    }
  }

  const selectedRole = roles.find((role) => role.value === formData.role)

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[360px_1fr]">
          <aside className="bg-slate-950 p-7 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">Tài khoản Công nghệ THPT</p>
            <h1 className="mt-4 text-3xl font-black leading-tight">Tham gia EngineLab Công nghệ</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Hệ thống chỉ phục vụ môn Công nghệ THPT, tập trung vào học liệu, nhiệm vụ, mô phỏng, game luyện tập và
              đánh giá năng lực.
            </p>

            <div className="mt-7 space-y-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => chooseRole(role.value)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    formData.role === role.value
                      ? 'border-blue-300 bg-blue-500/15'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">{role.title}</span>
                    <span className={`h-3 w-3 rounded-full ${formData.role === role.value ? 'bg-blue-300' : 'bg-slate-600'}`} />
                  </div>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">{role.subtitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{role.note}</p>
                </button>
              ))}
            </div>

            <div className="mt-7 rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-sm font-black">Dữ liệu sau khi tạo</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                {expectations.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="p-6 sm:p-8">
            <div className="mb-7 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
              <div>
                <p className="muted-label">Thông tin tài khoản</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">{selectedRole.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{selectedRole.subtitle}</p>
              </div>
              <Link to="/login" className="secondary-button">
                Đã có tài khoản
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Họ và tên đầy đủ</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="field-control"
                    placeholder={formData.role === 'student' ? 'VD: Nguyễn Minh An' : 'VD: Cô Nguyễn Thị Lan'}
                    required={formData.role === 'student'}
                  />
                </div>

                {formData.role === 'student' ? (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Lớp</label>
                    <input
                      type="text"
                      name="student_class"
                      value={formData.student_class}
                      onChange={handleChange}
                      className="field-control"
                      placeholder="VD: 11A1"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Vai trò</label>
                    <input type="text" value="Giáo viên Công nghệ" className="field-control bg-slate-50 text-slate-500" disabled readOnly />
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Tên đăng nhập</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="field-control"
                    placeholder="Chọn tên đăng nhập"
                    required
                    minLength="3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="field-control"
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="field-control"
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  minLength="8"
                />
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                {formData.role === 'student'
                  ? 'Tài khoản học sinh sẽ hiển thị họ tên và lớp trong nhiệm vụ, bài nộp, quiz và hồ sơ năng lực.'
                  : 'Tài khoản giáo viên dùng để tổ chức nội dung dạy học, kho học liệu, nhiệm vụ và hoạt động lớp.'}
              </div>

              <button type="submit" disabled={isLoading} className="primary-button w-full py-3">
                {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  )
}
