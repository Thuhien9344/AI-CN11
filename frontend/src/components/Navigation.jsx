import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Lộ trình', guide: 'Xem lộ trình học tập theo từng chương.' },
  { to: '/classroom', label: 'Lớp học', guide: 'Tham gia lớp học và nhận thông báo từ giáo viên.' },
  { to: '/games', label: 'Luyện tập', guide: 'Làm bài tập và ôn luyện kiến thức.' },
  { to: '/contests', label: 'Cuộc thi vui', guide: 'Tham gia mini game và thử thách kiến thức.' },
  { to: '/practice-bank', label: 'Kho đề', guide: 'Truy cập ngân hàng đề kiểm tra và quiz.' },
  { to: '/progress', label: 'Theo dõi tiến độ cá nhân', guide: 'Xem điểm số và quá trình học tập.' },
]

const navLinkClass = ({ isActive }) =>
  `menu-guide-trigger shrink-0 rounded-xl px-4 py-3 text-base font-black transition duration-300 ${
    isActive
      ? 'bg-white text-indigo-700 shadow-md ring-1 ring-indigo-100'
      : 'text-slate-700 hover:-translate-y-0.5 hover:bg-white hover:text-orange-600 hover:shadow-sm'
  }`

function MenuNavItem({ link, activeTooltip, setActiveTooltip, compact = false }) {
  const tooltipId = `menu-guide-${link.to.replace(/\W/g, '-') || 'home'}`
  const isTooltipPinned = activeTooltip === link.to

  const handleClick = () => {
    setActiveTooltip((current) => (current === link.to ? null : link.to))
  }

  return (
    <div
      className={`menu-guide-item relative ${compact ? 'shrink-0' : ''}`}
      onMouseEnter={() => setActiveTooltip(link.to)}
      onMouseLeave={() => setActiveTooltip((current) => (current === link.to ? null : current))}
      onFocus={() => setActiveTooltip(link.to)}
      onBlur={() => setActiveTooltip((current) => (current === link.to ? null : current))}
    >
      <NavLink
        to={link.to}
        className={navLinkClass}
        end={link.to === '/'}
        aria-describedby={tooltipId}
        onClick={handleClick}
      >
        {link.label}
      </NavLink>
      <div
        id={tooltipId}
        role="tooltip"
        className={`menu-guide-tooltip ${isTooltipPinned ? 'menu-guide-tooltip-visible' : ''} ${
          compact ? 'left-0 top-full mt-2' : 'left-1/2 top-full mt-3 -translate-x-1/2'
        }`}
      >
        {link.guide}
      </div>
    </div>
  )
}

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [activeTooltip, setActiveTooltip] = useState(null)
  const isTeacher = user?.role === 'teacher'
  const roleLabel = isTeacher ? 'Giáo viên Công nghệ' : 'Học sinh THPT'
  const displayName = user?.full_name || user?.username || 'Người dùng'
  const profileLabel = !isTeacher && user?.student_class ? `${displayName} - ${user.student_class}` : displayName

  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-sm backdrop-blur">
      <div className="border-b border-indigo-100 bg-white">
        <div className="mx-auto flex min-h-24 max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <span className="motion-float motion-shimmer flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-500 to-orange-500 text-lg font-black text-white shadow-lg">
              CN
            </span>
            <span className="min-w-0">
              <span className="block truncate bg-gradient-to-r from-indigo-600 via-blue-600 to-orange-500 bg-clip-text text-3xl font-black leading-tight text-transparent">
                EngineLab
              </span>
              <span className="block truncate text-sm font-black text-slate-600">Công nghệ THPT</span>
            </span>
          </NavLink>

          {isAuthenticated && (
            <nav className="hidden items-center gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1 shadow-inner xl:flex">
              {links.map((link) => (
                <MenuNavItem
                  key={link.to}
                  link={link}
                  activeTooltip={activeTooltip}
                  setActiveTooltip={setActiveTooltip}
                />
              ))}
            </nav>
          )}

          {isAuthenticated ? (
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-sky-50 px-4 py-3 text-right shadow-sm md:block">
                <div className="text-[11px] font-black uppercase tracking-wide text-indigo-500">{roleLabel}</div>
                <div className="max-w-48 truncate text-sm font-black text-slate-900">{profileLabel}</div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <NavLink
                to="/login"
                className="rounded-2xl border border-orange-200 bg-orange-50 px-7 py-3 text-base font-black text-orange-600 transition hover:bg-orange-100"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-2xl bg-orange-500 px-7 py-3 text-base font-black text-white shadow-md transition hover:bg-orange-600"
              >
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="border-b border-slate-100 bg-white xl:hidden">
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {links.map((link) => (
              <MenuNavItem
                key={link.to}
                link={link}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
                compact
              />
            ))}
          </nav>
        </div>
      )}

      <div className="motion-shimmer border-b border-amber-200 bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="motion-spin-slow flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
              ⚙
            </span>
            <p className="text-sm font-black text-red-600 sm:text-lg">
              Tuần học trực quan: khám phá cơ khí, động cơ đốt trong và ô tô bằng Nova 3D
            </p>
          </div>
          <NavLink
            to="/games"
            className="hidden rounded-2xl border border-indigo-200 bg-white px-5 py-2.5 text-base font-black text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md sm:inline-flex"
          >
            Luyện ngay →
          </NavLink>
        </div>
      </div>
    </header>
  )
}
