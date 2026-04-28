import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TEAM } from '../../data/mockData.js'
import { useNotifications } from '../../state/NotificationsProvider.jsx'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function getTitle(pathname) {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/projects') return 'Projects'
  if (pathname === '/projects/new') return 'New Project'
  if (pathname.startsWith('/projects/')) return 'Project Detail'
  if (pathname === '/notifications') return 'Notifications'
  return 'BoB Tracker'
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { notifications } = useNotifications()
  const hasNotifications = notifications.length > 0
  const sessionUser = TEAM.find((m) => m.name === 'Thato Seretse') ?? TEAM[1]
  const initials = getInitials(sessionUser.name)
  const title = getTitle(location.pathname)

  return (
    <header className="h-[60px] bg-card">
      <div className="flex h-full items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="icon-btn md:hidden"
            aria-label="Open navigation"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="leading-tight">
            <div className="font-heading text-[18px] font-bold text-textPrimary">
              {title}
            </div>
            <div className="mt-0.5 text-[11px] tracking-[0.3px] text-textSecondary">
              Bank of Botswana / {title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="icon-btn border-transparent hover:border-border"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="icon-btn relative border-transparent hover:border-border"
            aria-label="Notifications"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
            {hasNotifications ? (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-statusOrange" />
            ) : null}
          </button>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 transition-colors duration-150 hover:bg-mutedBg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-primary text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <div className="max-w-[160px] truncate text-[13px] font-semibold text-textPrimary">
                Thato Seretse
              </div>
              <ChevronDown className="h-[14px] w-[14px] text-textSecondary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
