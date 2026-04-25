import { Bell } from 'lucide-react'
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

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()
  const sessionUser = TEAM.find((m) => m.name === 'Thato Seretse') ?? TEAM[1]
  const initials = getInitials(sessionUser.name)
  const title = getTitle(location.pathname)

  return (
    <header className="h-16 bg-gradient-to-r from-primary to-primaryDeep text-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="font-heading text-base font-semibold">{title}</div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-white/15 bg-white/0 hover:bg-white/10"
            aria-label="Notifications"
            onClick={() => navigate('/notifications')}
          >
            <span className="relative">
              <Bell className="h-5 w-5 text-white" />
              {unreadCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-statusOrange px-1 text-xs font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              ) : null}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
