import { NavLink } from 'react-router-dom'
import {
  Bell,
  Building2,
  FolderKanban,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { TEAM } from '../../data/mockData.js'
import { useNotifications } from '../../state/NotificationsProvider.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', Icon: FolderKanban },
  { to: '/projects/new', label: 'New Project', Icon: PlusCircle },
  { to: '/notifications', label: 'Notifications', Icon: Bell, showDot: true },
]

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export default function Sidebar({ expanded = false, onNavigate }) {
  const sessionUser = TEAM.find((m) => m.name === 'Thato Seretse') ?? TEAM[1]
  const { notifications } = useNotifications()
  const hasNotifications = notifications.length > 0
  const [logoOk, setLogoOk] = useState(true)

  return (
    <aside
      className={[
        'shrink-0 bg-gradient-to-b from-sidebarStart via-primary to-sidebarEnd text-white',
        expanded ? 'w-64' : 'w-16 md:w-64',
      ].join(' ')}
    >
      <div className="flex h-full flex-col">
        <div className="px-4 pt-5 md:px-5">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex h-9 w-9 items-center justify-center">
              {logoOk ? (
                <img
                  src="/logo.png"
                  alt="Bank of Botswana"
                  className="h-9 w-9 object-contain"
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-white/10 text-sm font-bold text-white">
                  BoB
                </div>
              )}
            </div>

            <div
              className={[
                'min-w-0',
                expanded ? 'block' : 'hidden md:block',
              ].join(' ')}
            >
              <div className="font-heading text-[13px] font-bold tracking-[0.3px] text-white">
                Bank of Botswana
              </div>
              <div className="mt-1 text-[10px] font-normal uppercase tracking-[1.5px] text-white/50">
                Project Tracker
              </div>
            </div>
          </div>

          <div className="my-4 border-b border-white08" />
        </div>

        <nav className="px-2">
          {navItems.map(({ to, label, Icon, showDot }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'group relative flex items-center justify-center rounded-[6px] px-4 py-2.5 text-[13px] font-medium tracking-[0.2px] transition-all duration-150 ease-in-out md:justify-start',
                  'text-white/65 hover:bg-white/7 hover:text-white',
                  isActive
                    ? 'bg-white/12 border-l-3 border-teal pl-[13px] font-semibold text-white'
                    : 'border-l-3 border-transparent',
                ].join(' ')
              }
              end={to === '/projects'}
              title={label}
              onClick={() => onNavigate?.()}
            >
              <Icon className="h-4 w-4 text-white/65 group-hover:text-white md:mr-2.5" />
              <span
                className={[
                  'flex-1',
                  expanded ? 'block' : 'hidden md:block',
                ].join(' ')}
              >
                {label}
              </span>
              {showDot && hasNotifications ? (
                <span className="h-2 w-2 rounded-full bg-statusOrange" />
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white08 px-4 py-4 md:px-5">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
              {getInitials(sessionUser.name)}
            </div>
            <div
              className={[
                'min-w-0 flex-1',
                expanded ? 'block' : 'hidden md:block',
              ].join(' ')}
            >
              <div className="truncate text-xs font-semibold text-white">
                {sessionUser.name}
              </div>
              <div className="truncate text-[11px] text-white/50">{sessionUser.role}</div>
            </div>
            <Settings
              className={[
                'h-[14px] w-[14px] text-white/40',
                expanded ? 'block' : 'hidden md:block',
              ].join(' ')}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
