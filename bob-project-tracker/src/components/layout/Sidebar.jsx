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
    <aside className="w-[260px] shrink-0 bg-gradient-to-b from-primary to-[#102F5D] text-white">
      <div className="flex h-full flex-col">
        <div className="px-5 py-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-white" />
            <div className="font-heading text-[16px] font-semibold tracking-tight">
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
                  'group relative flex items-center gap-3 rounded-[6px] px-4 py-3 text-[14px] font-medium text-white/90 hover:bg-white/10',
                  isActive
                    ? 'bg-white/10 border-l-[3px] border-teal pl-[13px] text-white'
                    : 'border-l-[3px] border-transparent',
                ].join(' ')
              }
              end={to === '/projects'}
            >
              <Icon className="h-[18px] w-[18px] text-white/90 group-hover:text-white" />
              <span className="flex-1">{label}</span>
              {showDot && attentionCount > 0 ? (
                <span className="h-2 w-2 rounded-full bg-statusOrange" />
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 px-5 py-4">
          <div className="text-[12px] text-white/80">
            {sessionUser.name} — {sessionUser.role}
          </div>
          <div className="mt-1 text-[11px] text-white/60">
            Session: {getInitials(sessionUser.name)}
          </div>
        </div>
      </div>
    </aside>
  )
}

