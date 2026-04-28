import { useMemo, useState } from 'react'
import { ArrowUpCircle, Check, CheckCircle, Lock, Send } from 'lucide-react'
import { useParams } from 'react-router-dom'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import WorkflowProgress from '../components/ui/WorkflowProgress.jsx'
import { PROJECTS, TEAM } from '../data/mockData.js'
import { useToast } from '../state/ToastProvider.jsx'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function stageLabel(stage) {
  const map = {
    draft: 'Draft',
    'waiting-review': 'Waiting for Review',
    'signed-off': 'Signed Off',
    finalized: 'Finalized to Director',
    resolved: 'Resolved',
  }
  return map[stage] ?? 'Draft'
}

function priorityLabel(priority) {
  if (priority === 'high') return 'High'
  if (priority === 'medium') return 'Medium'
  return 'Low'
}

function priorityDot(priority) {
  if (priority === 'high') return '#DC2626'
  if (priority === 'medium') return '#D97706'
  return '#16A34A'
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { showToast } = useToast()

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
  const sessionUser = TEAM.find((m) => m.name === 'Thato Seretse') ?? TEAM[1]

  const [stage, setStage] = useState(project.workflowStage)
  const [comments, setComments] = useState(project.comments ?? [])
  const [auditTrail, setAuditTrail] = useState(project.auditTrail ?? [])
  const [newComment, setNewComment] = useState('')
  const [newCommentType, setNewCommentType] = useState('feedback')

  const actionMeta = (() => {
    if (stage === 'draft') {
      return {
        label: 'Submit for Review',
        Icon: Send,
        nextStage: 'waiting-review',
        className: 'bg-primary hover:bg-sidebarStart text-white',
      }
    }
    if (stage === 'waiting-review') {
      return {
        label: 'Sign Off',
        Icon: CheckCircle,
        nextStage: 'signed-off',
        className: 'bg-statusGreen hover:bg-green-800 text-white',
      }
    }
    if (stage === 'signed-off') {
      return {
        label: 'Finalize to Director',
        Icon: ArrowUpCircle,
        nextStage: 'finalized',
        className: 'bg-primary hover:bg-sidebarStart text-white',
      }
    }
    if (stage === 'finalized') {
      return {
        label: 'Mark Resolved',
        Icon: Check,
        nextStage: 'resolved',
        className: 'bg-statusGreen hover:bg-green-800 text-white',
      }
    }
    return null
  })()

  function pushAudit(action, note) {
    const ts = new Date().toISOString()
    setAuditTrail((prev) => [
      {
        id: `a-local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        action,
        performedBy: sessionUser.id,
        timestamp: ts,
        note,
      },
      ...prev,
    ])
  }

  function onAdvanceStage() {
    if (!actionMeta) return
    const next = actionMeta.nextStage
    setStage(next)
    pushAudit(`Workflow Advanced to ${stageLabel(next)}`, `${sessionUser.name} moved the project forward.`)
    showToast({ title: 'Workflow updated', message: `Stage is now ${stageLabel(next)}.` })
  }

  function onPostComment() {
    const text = newComment.trim()
    if (!text) return

    const ts = new Date().toISOString()
    setComments((prev) => [
      ...prev,
      {
        id: `c-local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        author: sessionUser.name,
        text,
        timestamp: ts,
        type: newCommentType,
      },
    ])
    pushAudit('Comment Added', `${sessionUser.name} posted a ${newCommentType} note.`)
    setNewComment('')
    showToast({ title: 'Comment posted', message: 'Added to the project thread.' })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-semibold text-textPrimary">
            {project.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} size="sm" />
            <StatusBadge status={stage} size="sm" />
            <span className="text-sm text-textSecondary">{project.type}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionMeta ? (
            <button
              type="button"
              onClick={onAdvanceStage}
              className={[
                'inline-flex items-center gap-2 rounded-btn px-[18px] py-2 text-[13px] font-semibold transition-colors duration-150',
                actionMeta.className,
              ].join(' ')}
            >
              <actionMeta.Icon className="h-4 w-4" />
              <span>{actionMeta.label}</span>
            </button>
          ) : (
            <span className="inline-flex items-center rounded-[4px] border border-border bg-mutedBg px-3 py-2 text-[13px] font-semibold text-textSecondary">
              Resolved
            </span>
          )}
        </div>
      </div>

      <div className="rounded-card border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-heading text-base font-semibold text-textPrimary">
              Workflow
            </div>
            <div className="mt-1 text-sm text-textSecondary">
              Draft to resolution approval chain
            </div>
          </div>
          <div className="text-right text-xs text-textSecondary">
            Current stage
            <div className="mt-1 text-sm font-semibold text-textPrimary">{stageLabel(stage)}</div>
          </div>
        </div>
        <div className="mt-5">
          <WorkflowProgress stage={stage} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-card border border-border bg-card p-6">
            <div className="font-heading text-base font-semibold text-textPrimary">
              Project Information
            </div>
            <div className="mt-2 text-sm text-textSecondary">{project.description}</div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: 'Start Date', value: formatDate(project.startDate) },
                { label: 'Deadline', value: formatDate(project.deadline) },
                { label: 'Inspection Date', value: formatDate(project.inspectionDate) },
                { label: 'Audit Date', value: formatDate(project.auditDate) },
              ].map((row) => (
                <div key={row.label} className="rounded-card border border-border bg-card p-6">
                  <div className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
                    {row.label}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-textPrimary">{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-heading text-base font-semibold text-textPrimary">
                  Comments and Feedback
                </div>
                <div className="mt-1 text-sm text-textSecondary">
                  Threaded notes for reports and reviewer feedback
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-card border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCommentType('report')}
                    className={[
                      'rounded-btn border px-3 py-2 text-sm font-semibold transition-colors duration-150',
                      newCommentType === 'report'
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-card text-textPrimary hover:bg-mutedBg',
                    ].join(' ')}
                  >
                    Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCommentType('feedback')}
                    className={[
                      'rounded-btn border px-3 py-2 text-sm font-semibold transition-colors duration-150',
                      newCommentType === 'feedback'
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-card text-textPrimary hover:bg-mutedBg',
                    ].join(' ')}
                  >
                    Feedback
                  </button>
                </div>

                <div className="text-xs text-textSecondary">
                  Posting as <span className="font-semibold text-textPrimary">{sessionUser.name}</span>
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mt-3 w-full rounded-btn border border-border bg-white px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="Write a comment..."
              />

              <div className="mt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={onPostComment}
                  disabled={newComment.trim().length === 0}
                  className={[
                    'inline-flex items-center gap-2 rounded-btn bg-primary px-[18px] py-2 text-[13px] font-semibold text-white transition-colors duration-150',
                    newComment.trim().length === 0
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:bg-sidebarStart',
                  ].join(' ')}
                >
                  <Send className="h-4 w-4" />
                  <span>Post</span>
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {comments.length === 0 ? (
                <div className="text-sm text-textSecondary">No comments yet.</div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="rounded-card border border-border bg-card p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-textPrimary">{c.author}</div>
                        <span className="inline-flex items-center rounded-[4px] border border-border bg-mutedBg px-2 py-[3px] text-[11px] font-semibold text-textSecondary">
                          {c.type === 'report' ? 'Report' : 'Feedback'}
                        </span>
                      </div>
                      <div className="text-xs text-textSecondary">{formatDateTime(c.timestamp)}</div>
                    </div>
                    <div className="mt-2 text-sm text-textSecondary">{c.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-heading text-base font-semibold text-textPrimary">
                  Audit Trail
                </div>
                <div className="mt-1 text-sm text-textSecondary">
                  Blockchain-verified activity trail
                </div>
              </div>
              <div className="text-right text-xs text-textSecondary">
                Immutable log
                <div className="mt-1 text-sm font-semibold text-textPrimary">
                  {auditTrail.length} entries
                </div>
              </div>
            </div>

            {auditTrail.length === 0 ? (
              <div className="mt-4 text-sm text-textSecondary">No audit entries yet.</div>
            ) : (
              <div className="mt-5">
                <div className="space-y-4">
                  {auditTrail
                    .slice()
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((a, idx, arr) => {
                      const actor = TEAM.find((m) => m.id === a.performedBy)?.name ?? 'Unknown'
                      const isLast = idx === arr.length - 1
                      return (
                        <div key={a.id} className="flex gap-3">
                          <div className="relative flex w-10 justify-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
                              <Lock className="h-4 w-4 text-textSecondary" />
                            </div>
                            {!isLast ? (
                              <div className="absolute bottom-0 top-9 w-px bg-border" />
                            ) : null}
                          </div>

                          <div className="min-w-0 flex-1 rounded-card border border-border bg-card p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="text-sm font-semibold text-textPrimary">
                                {a.action}
                              </div>
                              <div className="text-xs text-textSecondary">
                                {formatDateTime(a.timestamp)}
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-textSecondary">
                              <span className="font-medium text-textPrimary">{actor}</span>: {a.note}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-card border border-border bg-card p-6">
            <div className="font-heading text-base font-semibold text-textPrimary">
              Assigned Member
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-primary text-sm font-bold text-white">
                {assignee?.avatar ?? '--'}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-textPrimary">
                  {assignee?.name ?? 'Unassigned'}
                </div>
                <div className="truncate text-sm text-textSecondary">
                  {assignee?.role ?? 'No role set'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-6">
            <div className="font-heading text-base font-semibold text-textPrimary">Key Dates</div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Start', value: formatDate(project.startDate) },
                { label: 'Deadline', value: formatDate(project.deadline) },
                { label: 'Inspection', value: formatDate(project.inspectionDate) },
                { label: 'Audit', value: formatDate(project.auditDate) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div className="text-sm text-textSecondary">{row.label}</div>
                  <div className="text-sm font-semibold text-textPrimary">{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-6">
            <div className="font-heading text-base font-semibold text-textPrimary">
              Quick Stats
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-textSecondary">Status</div>
                <StatusBadge status={project.status} size="sm" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-textSecondary">Workflow</div>
                <StatusBadge status={stage} size="sm" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-textSecondary">Priority</div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: priorityDot(project.priority) }}
                    aria-label={project.priority}
                    title={project.priority}
                  />
                  <div className="text-sm font-semibold text-textPrimary">
                    {priorityLabel(project.priority)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
