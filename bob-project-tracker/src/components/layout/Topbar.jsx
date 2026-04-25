import { Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { TEAM } from '../../data/mockData.js'

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
  const sessionUser = TEAM.find((m) => m.name === 'Thato Seretse') ?? TEAM[1]
  const initials = getInitials(sessionUser.name)
  const title = getTitle(location.pathname)

  return (
    <header className="h-[64px] bg-gradient-to-r from-primary to-[#102F5D] text-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="font-heading text-[16px] font-semibold">{title}</div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-white/15 bg-white/0 hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[12px] font-semibold text-white">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

