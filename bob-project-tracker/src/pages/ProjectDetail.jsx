import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { PROJECTS, TEAM } from '../data/mockData.js'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export default function ProjectDetail() {
  const { id } = useParams()

  const project = useMemo(() => {
    const direct = PROJECTS.find((p) => String(p.id) === String(id))
    if (direct) return direct

    const asNumber = Number.parseInt(String(id), 10)
    if (!Number.isNaN(asNumber) && asNumber >= 1 && asNumber <= PROJECTS.length) {
      return PROJECTS[asNumber - 1]
    }

    return null
  }, [id])

  if (!project) {
    return (
      <div className="rounded-card border border-border bg-card p-10 text-center">
        <div className="font-heading text-base font-semibold text-textPrimary">
          Project not found
        </div>
        <div className="mt-1 text-sm text-textSecondary">
          The project ID "{id}" does not exist in the mock data.
        </div>
      </div>
    )
  }

  const assignee = TEAM.find((m) => m.id === project.assignedTo)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-semibold text-textPrimary">
            {project.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} size="sm" />
            <StatusBadge status={project.workflowStage} size="sm" />
            <span className="text-sm text-textSecondary">{project.type}</span>
          </div>
        </div>
        <div className="rounded-card border border-border bg-card px-4 py-3 text-sm text-textSecondary">
          Assigned to:{' '}
          <span className="font-medium text-textPrimary">
            {assignee ? assignee.name : 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="rounded-card border border-border bg-card p-6">
        <div className="font-heading text-base font-semibold">Overview</div>
        <div className="mt-2 text-sm text-textSecondary">{project.description}</div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
              Start Date
            </div>
            <div className="mt-1 text-sm font-semibold text-textPrimary">
              {formatDate(project.startDate)}
            </div>
          </div>
          <div className="rounded-card border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
              Deadline
            </div>
            <div className="mt-1 text-sm font-semibold text-textPrimary">
              {formatDate(project.deadline)}
            </div>
          </div>
          <div className="rounded-card border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
              Inspection Date
            </div>
            <div className="mt-1 text-sm font-semibold text-textPrimary">
              {formatDate(project.inspectionDate)}
            </div>
          </div>
          <div className="rounded-card border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
              Audit Date
            </div>
            <div className="mt-1 text-sm font-semibold text-textPrimary">
              {formatDate(project.auditDate)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-card border border-border bg-card p-6">
          <div className="font-heading text-base font-semibold">Comments</div>
          <div className="mt-4 space-y-3">
            {(project.comments ?? []).length === 0 ? (
              <div className="text-sm text-textSecondary">No comments yet.</div>
            ) : (
              project.comments.map((c) => (
                <div key={c.id} className="rounded-card border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-textPrimary">
                      {c.author}
                    </div>
                    <div className="text-xs text-textSecondary">
                      {formatDate(c.timestamp)}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-textSecondary">{c.text}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-6">
          <div className="font-heading text-base font-semibold">Audit Trail</div>
          <div className="mt-4 space-y-3">
            {(project.auditTrail ?? []).length === 0 ? (
              <div className="text-sm text-textSecondary">No audit entries yet.</div>
            ) : (
              project.auditTrail.map((a) => {
                const actor = TEAM.find((m) => m.id === a.performedBy)?.name ?? 'Unknown'
                return (
                  <div key={a.id} className="rounded-card border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-textPrimary">{a.action}</div>
                      <div className="text-xs text-textSecondary">
                        {formatDate(a.timestamp)}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-textSecondary">
                      {actor}: {a.note}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
