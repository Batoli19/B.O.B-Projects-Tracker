import { Link } from 'react-router-dom'
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  FolderKanban,
} from 'lucide-react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import KPICard from '../components/ui/KPICard.jsx'
import { PROJECTS, TEAM } from '../data/mockData.js'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function daysUntil(dateStr) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(dateStr)
  const diffMs = target.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function formatRelativeTime(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(dateStr)
}

function verbFromAction(action) {
  if (!action) return 'updated'
  if (action.toLowerCase().includes('created')) return 'created'
  if (action.toLowerCase().includes('comment')) return 'commented on'
  if (action.toLowerCase().includes('signed off')) return 'signed off'
  if (action.toLowerCase().includes('finalized')) return 'finalized'
  if (action.toLowerCase().includes('resolved')) return 'resolved'
  if (action.toLowerCase().includes('status updated')) return 'updated'
  return 'updated'
}

const STATUS_COLORS = {
  Completed: '#16A34A',
  'On Track': '#1A3A6B',
  'At Risk': '#D97706',
  Overdue: '#DC2626',
}

const TYPE_COLORS = {
  Audit: '#2563EB',
  IT: '#0EA5E9',
  Compliance: '#6366F1',
  Inspection: '#14B8A6',
  Policy: '#64748B',
  Research: '#A855F7',
}

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] ?? '#64748B'
  return (
    <span
      className="inline-flex items-center rounded-btn border px-2 py-0.5 text-xs font-medium"
      style={{ borderColor: color, color }}
    >
      {type}
    </span>
  )
}

export default function Dashboard() {
  const totalProjects = PROJECTS.length
  const completedCount = PROJECTS.filter((p) => p.status === 'completed').length
  const inProgressCount = PROJECTS.filter(
    (p) => p.status === 'on-track' || p.status === 'at-risk',
  ).length
  const overdueCount = PROJECTS.filter((p) => p.status === 'overdue').length

  const attentionCount = PROJECTS.filter(
    (p) => p.workflowStage === 'waiting-review' || p.status === 'overdue',
  ).length

  const statusData = [
    { name: 'Completed', value: completedCount },
    {
      name: 'On Track',
      value: PROJECTS.filter((p) => p.status === 'on-track').length,
    },
    { name: 'At Risk', value: PROJECTS.filter((p) => p.status === 'at-risk').length },
    { name: 'Overdue', value: overdueCount },
  ].filter((d) => d.value > 0)

  const typeData = Object.entries(
    PROJECTS.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] ?? 0) + 1
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

  const upcoming = (() => {
    const future = PROJECTS.filter((p) => daysUntil(p.deadline) >= 0)
    const sorted = future.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    return sorted.slice(0, 5)
  })()

  const recentActivity = PROJECTS.flatMap((p) =>
    (p.auditTrail ?? []).map((entry) => ({
      ...entry,
      projectTitle: p.title,
      member: TEAM.find((m) => m.id === entry.performedBy),
    })),
  )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return (
    <div className="space-y-6">
      {attentionCount > 0 ? (
        <div className="rounded-card border border-statusOrange bg-warnBg p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-statusOrange" />
              <div className="text-sm text-textPrimary">
                You have <span className="font-semibold">{attentionCount}</span>{' '}
                items awaiting your attention
              </div>
            </div>
            <Link
              to="/notifications"
              className="text-sm font-medium text-teal hover:underline"
            >
              View all →
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Total Projects"
          value={totalProjects}
          icon={FolderKanban}
          accentColor="#1A3A6B"
        />
        <KPICard
          label="Completed"
          value={completedCount}
          icon={CheckCircle}
          accentColor="#16A34A"
        />
        <KPICard
          label="In Progress"
          value={inProgressCount}
          icon={Clock}
          accentColor="#D97706"
        />
        <KPICard
          label="Overdue"
          value={overdueCount}
          icon={AlertCircle}
          accentColor="#DC2626"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-card border border-border bg-card p-6 xl:col-span-3">
          <div className="font-heading text-base font-semibold">
            Project Status Overview
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={2}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] ?? '#64748B'}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={48} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-6 xl:col-span-2">
          <div className="font-heading text-base font-semibold">Projects by Type</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={2}
                >
                  {typeData.map((entry) => (
                    <Cell key={entry.name} fill={TYPE_COLORS[entry.name] ?? '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={48} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-card border border-border bg-card p-6">
          <div className="font-heading text-base font-semibold">Upcoming Deadlines</div>
          {upcoming.length === 0 ? (
            <div className="mt-4 text-sm text-textSecondary">No upcoming deadlines.</div>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {upcoming.map((p) => {
                const remaining = daysUntil(p.deadline)
                const remainingColor =
                  remaining <= 7
                    ? 'text-statusRed'
                    : remaining <= 30
                      ? 'text-statusOrange'
                      : 'text-textSecondary'
                const assigned = TEAM.find((m) => m.id === p.assignedTo)
                return (
                  <div key={p.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-textPrimary">
                        {p.title}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <TypeBadge type={p.type} />
                        <div className="text-xs text-textSecondary">
                          {assigned ? assigned.name : 'Unassigned'}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-sm font-medium text-textPrimary">
                        {formatDate(p.deadline)}
                      </div>
                      <div className={`mt-1 text-xs font-medium ${remainingColor}`}>
                        {remaining} days left
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-card border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-textSecondary" />
            <div className="font-heading text-base font-semibold">Recent Activity</div>
          </div>
          <div className="mt-4 space-y-3">
            {recentActivity.map((entry) => {
              const name = entry.member?.name ?? 'Unknown'
              const initials = entry.member?.avatar ?? '—'
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-textPrimary">
                      <span className="font-medium">{name}</span>{' '}
                      {verbFromAction(entry.action)}{' '}
                      <span className="font-medium">{entry.projectTitle}</span>
                    </div>
                    <div className="mt-1 text-xs text-textSecondary">
                      {formatRelativeTime(entry.timestamp)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
