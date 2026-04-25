import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Bell, CheckCircle, Clock } from 'lucide-react'
import { useNotifications } from '../state/NotificationsProvider.jsx'

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
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(then)
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'awaiting', label: 'Awaiting Action' },
  { key: 'deadline', label: 'Deadlines' },
  { key: 'overdue', label: 'Overdue' },
]

function metaForKind(kind) {
  if (kind === 'awaiting') {
    return { Icon: Bell, iconClass: 'text-statusOrange' }
  }
  if (kind === 'overdue') {
    return { Icon: AlertCircle, iconClass: 'text-statusRed' }
  }
  if (kind === 'deadline') {
    return { Icon: Clock, iconClass: 'text-statusOrange' }
  }
  return { Icon: CheckCircle, iconClass: 'text-primary' }
}

export default function Notifications() {
  const { notifications, markAllRead, markRead } = useNotifications()
  const [activeTab, setActiveTab] = useState('all')

  const filtered = useMemo(() => {
    if (activeTab === 'all') return notifications
    return notifications.filter((n) => n.kind === activeTab)
  }, [notifications, activeTab])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-semibold">Notifications</h1>
        <button
          type="button"
          onClick={markAllRead}
          className="rounded-btn border border-border bg-card px-3 py-2 text-sm font-semibold text-textPrimary hover:bg-mutedBg"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = t.key === activeTab
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={[
                'rounded-btn border px-3 py-2 text-sm font-semibold',
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-card text-textPrimary hover:bg-mutedBg',
              ].join(' ')}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-border bg-card p-10 text-center">
          <div className="text-sm font-semibold text-textPrimary">No notifications</div>
          <div className="mt-1 text-sm text-textSecondary">
            You are all caught up for this filter.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const { Icon, iconClass } = metaForKind(n.kind)
            return (
              <div
                key={n.id}
                className={[
                  'rounded-card border border-border p-4',
                  n.unread ? 'border-l-3 border-l-primary bg-mutedBg' : 'bg-card',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-card">
                      <Icon className={['h-5 w-5', iconClass].join(' ')} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-textPrimary">
                        {n.title}
                      </div>
                      <div className="mt-1 text-sm text-textSecondary">
                        {n.description}
                      </div>
                      <div className="mt-2">
                        <Link
                          to={`/projects/${n.projectId}`}
                          onClick={() => markRead(n.id)}
                          className="text-sm font-medium text-teal hover:underline"
                        >
                          View Project →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right text-xs text-textSecondary">
                    {formatRelativeTime(n.timestamp)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
