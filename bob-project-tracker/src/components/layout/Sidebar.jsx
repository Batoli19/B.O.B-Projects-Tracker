import { NavLink } from 'react-router-dom'
import {
  Bell,
  Building2,
  FolderKanban,
  LayoutDashboard,
  PlusCircle,
} from 'lucide-react'
import { PROJECTS, TEAM } from '../../data/mockData.js'

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

export default function Sidebar() {
  const sessionUser = TEAM.find((m) => m.name === 'Thato Seretse') ?? TEAM[1]
  const attentionCount = PROJECTS.filter(
    (p) => p.workflowStage === 'waiting-review' || p.status === 'overdue',
  ).length

  return (
    <aside className="w-16 shrink-0 bg-gradient-to-b from-primary to-primaryDeep text-white md:w-64">
      <div className="flex h-full flex-col">
        <div className="px-4 py-5 md:px-5">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <Building2 className="h-5 w-5 text-white" />
            <div className="hidden font-heading text-base font-semibold tracking-tight md:block">
              BoB Tracker
            </div>
          </div>
        </div>

        <nav className="px-2">
          {navItems.map(({ to, label, Icon, showDot }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'group relative flex items-center justify-center gap-3 rounded-btn px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10 md:justify-start md:px-4',
                  isActive
                    ? 'bg-white/10 border-l-3 border-teal text-white md:pl-3'
                    : 'border-l-3 border-transparent',
                ].join(' ')
              }
              end={to === '/projects'}
              title={label}
            >
              <Icon className="h-5 w-5 text-white/90 group-hover:text-white" />
              <span className="hidden flex-1 md:block">{label}</span>
              {showDot && attentionCount > 0 ? (
                <span className="h-2 w-2 rounded-full bg-statusOrange" />
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 px-4 py-4 md:px-5">
          <div className="hidden text-xs text-white/80 md:block">
            {sessionUser.name} - {sessionUser.role}
          </div>
          <div className="hidden text-xs text-white/60 md:block">
            Session: {getInitials(sessionUser.name)}
          </div>
        </div>
      </div>
    </aside>
  )
}
