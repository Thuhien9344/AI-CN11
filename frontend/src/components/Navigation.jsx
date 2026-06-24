import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store'
import { useEffect, useRef, useState } from 'react'

const studentLinks = [
  { to: '/', label: 'Lo trinh', icon: 'LT', guide: 'Chon chuong hoc theo CN10, CN11, CN12.' },
  { to: '/classroom', label: 'Lop hoc', icon: 'LH', guide: 'Xem thong bao, hoc lieu, nhiem vu va nop bai.' },
  { to: '/practice-bank', label: 'Kho de', icon: 'KD', guide: 'Lam de kiem tra, xem diem va giai thich.' },
  { to: '/progress', label: 'Tien do', icon: 'TD', guide: 'Xem diem so, tien do va goi y hoc tiep.' },
]

const teacherLinks = [
  { to: '/classroom', label: 'Quan ly lop', icon: 'QL', guide: 'Dang thong bao, giao nhiem vu, tai hoc lieu va theo doi bai nop.' },
  { to: '/', label: 'Tong quan', icon: 'TQ', guide: 'Xem si so, lop can theo doi va thong ke hoc tap.' },
  { to: '/practice-bank', label: 'Kho de', icon: 'KD', guide: 'Mo de kiem tra va noi dung on tap theo chuong.' },
  { to: '/progress', label: 'Tien do', icon: 'TD', guide: 'Quan sat tien do va ho so nang luc.' },
]

const navLinkClass = ({ isActive }) =>
  `menu-guide-trigger inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-black transition duration-200 ${
    isActive
      ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
      : 'text-slate-700 hover:bg-white hover:text-blue-700 hover:shadow-sm'
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
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-700">
          {link.icon}
        </span>
        <span>{link.label}</span>
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
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const isTeacher = user?.role === 'teacher'
  const links = isTeacher ? teacherLinks : studentLinks
  const displayName = user?.full_name || user?.username || 'Nguoi dung'
  const profileLabel = !isTeacher && user?.student_class ? `${displayName} - ${user.student_class}` : displayName
  const registrationRows = [
    { label: 'Ho va ten', value: displayName },
    { label: 'Ten dang nhap', value: user?.username || 'Chua co' },
    { label: 'Email', value: user?.email || 'Chua cap nhat' },
    { label: 'Loai tai khoan', value: isTeacher ? 'Giao vien' : 'Hoc sinh' },
    { label: 'Lop', value: isTeacher ? 'Khong ap dung' : user?.student_class || 'Chua cap nhat' },
  ]
  const avatarInitials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(-2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'CN'
  const profileMeta = isTeacher ? 'Giao vien Cong nghe' : user?.student_class ? `Hoc sinh lop ${user.student_class}` : 'Hoc sinh THPT'

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setIsProfileOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsProfileOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLogout = () => {
    setIsProfileOpen(false)
    logout()
  }


  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-[0_10px_30px_rgba(37,99,235,0.12)] backdrop-blur-xl">
      <div className="border-b border-sky-100 bg-gradient-to-r from-white via-sky-50 to-indigo-50">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-base font-black text-white shadow-lg shadow-cyan-200/70 ring-1 ring-white/80">
              CN
            </span>
            <span className="min-w-0">
              <span className="block truncate text-2xl font-black leading-tight bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                EngineLab
              </span>
              <span className="block truncate text-sm font-black text-slate-500">Công nghệ THPT</span>
            </span>
          </NavLink>

          {isAuthenticated && (
            <nav className="hidden items-center gap-1 rounded-2xl border border-white/80 bg-white/70 p-1.5 shadow-inner shadow-sky-100/80 ring-1 ring-sky-100 xl:flex">
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
            <div className="relative flex shrink-0 items-center gap-2" ref={profileMenuRef}>
              <NavLink
                to="/"
                className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md lg:flex"
                title="Bang dieu khien"
              >
                <span className="grid grid-cols-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <span key={index} className="h-1.5 w-1.5 rounded-sm bg-current" />
                  ))}
                </span>
              </NavLink>
              <NavLink
                to="/classroom"
                className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-black text-cyan-700 shadow-sm ring-1 ring-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-md md:flex"
                title="Lop hoc"
              >
                LH
              </NavLink>
              <NavLink
                to="/progress"
                className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-black text-indigo-700 shadow-sm ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md sm:flex"
                title="Ho so"
              >
                HS
              </NavLink>
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-300 p-0.5 shadow-lg shadow-cyan-200/70 ring-2 ring-white transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                title={profileLabel}
              >
                <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-800 via-slate-800 to-emerald-700 text-sm font-black text-white">
                  {avatarInitials}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-600 to-cyan-500 text-[10px] text-white shadow-sm">
                  v
                </span>
              </button>

              {isProfileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-3 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-slate-700 bg-[#242526] p-3 text-white shadow-2xl"
                >
                  <div className="rounded-xl bg-[#2f3031] p-4 shadow-lg">
                    <NavLink
                      to="/progress"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/10"
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 via-white to-amber-100 p-0.5">
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-base font-black text-white">
                          {avatarInitials}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-lg font-black">{displayName}</span>
                        <span className="block truncate text-sm font-semibold text-slate-300">{profileMeta}</span>
                      </span>
                    </NavLink>
                    <div className="my-3 h-px bg-slate-600" />
                    <NavLink
                      to="/progress"
                      onClick={() => setIsProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/10"
                    >
                      Xem ho so ca nhan
                    </NavLink>
                    <div className="mt-3 rounded-xl bg-[#242526] p-3">
                      <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Thong tin dang ky</p>
                      <div className="space-y-2">
                        {registrationRows.map((row) => (
                          <div key={row.label} className="grid grid-cols-[105px_1fr] gap-2 text-xs">
                            <span className="font-bold text-slate-400">{row.label}</span>
                            <span className="min-w-0 truncate font-semibold text-slate-100">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <NavLink
                      to="/classroom"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-100 transition hover:bg-white/10"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black">LH</span>
                      Lop hoc va nhiem vu
                    </NavLink>
                    <NavLink
                      to="/progress"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-100 transition hover:bg-white/10"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black">HS</span>
                      Ho so nang luc
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-100 transition hover:bg-white/10"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black">DX</span>
                      Dang xuat
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <NavLink
                to="/login"
                className="rounded-lg border border-orange-200 bg-orange-50 px-5 py-2.5 text-sm font-black text-orange-600 transition hover:bg-orange-100"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-orange-600"
              >
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="border-b border-slate-100 bg-white xl:hidden">
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
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

    </header>
  )
}
