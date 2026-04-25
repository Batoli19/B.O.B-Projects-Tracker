import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, PlusCircle, Search } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { PROJECTS, TEAM } from '../data/mockData.js'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function stageLabel(stage) {
  const map = {
    draft: 'Draft',
    'waiting-review': 'Waiting Review',
    'signed-off': 'Signed Off',
    finalized: 'Finalized',
    resolved: 'Resolved',
  }
  return map[stage] ?? 'Draft'
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
      className="inline-flex items-center rounded-btn border px-2 py-[2px] text-[12px] font-medium"
      style={{ borderColor: color, color }}
    >
      {type}
    </span>
  )
}

function priorityDot(priority) {
  if (priority === 'high') return '#DC2626'
  if (priority === 'medium') return '#D97706'
  return '#16A34A'
}

export default function Projects() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [assignedTo, setAssignedTo] = useState('all')

  const hasActiveFilters =
    query.trim() !== '' || status !== 'all' || type !== 'all' || assignedTo !== 'all'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PROJECTS.filter((p) => {
      const matchesQuery =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      const matchesStatus = status === 'all' || p.status === status
      const matchesType = type === 'all' || p.type === type
      const matchesAssigned =
        assignedTo === 'all' || String(p.assignedTo) === String(assignedTo)
      return matchesQuery && matchesStatus && matchesType && matchesAssigned
    })
  }, [query, status, type, assignedTo])

  const stats = useMemo(() => {
    const total = filtered.length
    const completed = filtered.filter((p) => p.status === 'completed').length
    const inProgress = filtered.filter(
      (p) => p.status === 'on-track' || p.status === 'at-risk',
    ).length
    const overdue = filtered.filter((p) => p.status === 'overdue').length
    return { total, completed, inProgress, overdue }
  }, [filtered])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-[20px] font-semibold">All Projects</h1>
        <button
          type="button"
          onClick={() => navigate('/projects/new')}
          className="inline-flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
        >
          <PlusCircle className="h-4 w-4 text-white" />
          <span>New Project</span>
        </button>
      </div>

      <div className="rounded-card border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="h-10 w-full rounded-btn border border-border bg-white pl-9 pr-3 text-[14px] text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 w-full rounded-btn border border-border bg-white px-3 text-[14px] text-textPrimary focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30"
          >
            <option value="all">All Statuses</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-10 w-full rounded-btn border border-border bg-white px-3 text-[14px] text-textPrimary focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30"
          >
            <option value="all">All Types</option>
            <option value="Audit">Audit</option>
            <option value="IT">IT</option>
            <option value="Compliance">Compliance</option>
            <option value="Inspection">Inspection</option>
            <option value="Policy">Policy</option>
            <option value="Research">Research</option>
          </select>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="h-10 w-full rounded-btn border border-border bg-white px-3 text-[14px] text-textPrimary focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30"
          >
            <option value="all">All Assignees</option>
            {TEAM.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-end">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setStatus('all')
                  setType('all')
                  setAssignedTo('all')
                }}
                className="text-[14px] font-medium text-teal hover:underline"
              >
                Clear Filters
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <div className="text-[14px] text-textSecondary">
        {stats.total} total · {stats.completed} completed · {stats.inProgress} in progress
        · {stats.overdue} overdue
      </div>

      <div className="rounded-card border border-border bg-surface">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {[
                  '#',
                  'Project Title',
                  'Type',
                  'Status',
                  'Workflow Stage',
                  'Assigned To',
                  'Deadline',
                  'Priority',
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-textSecondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FolderOpen className="h-12 w-12 text-[#94A3B8]" />
                      <div className="text-[14px] font-semibold text-textPrimary">
                        No projects found
                      </div>
                      <div className="text-[13px] text-textSecondary">
                        Try adjusting your filters
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const assignee = TEAM.find((m) => m.id === p.assignedTo)
                  const deadlineIsOverdue =
                    p.status === 'overdue' || new Date(p.deadline).getTime() < Date.now()
                  return (
                    <tr
                      key={p.id}
                      className="cursor-pointer border-t border-border hover:bg-[#F8FAFC]"
                      onClick={() => navigate(`/projects/${p.id}`)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-[13px] text-textSecondary">
                        {idx + 1}
                      </td>
                      <td className="min-w-[260px] px-4 py-3 text-[14px] font-semibold text-textPrimary">
                        {p.title}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <TypeBadge type={p.type} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex items-center rounded-btn border border-border bg-[#F8FAFC] px-2 py-[2px] text-[12px] font-medium text-textSecondary">
                          {stageLabel(p.workflowStage)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                            {assignee?.avatar ?? '—'}
                          </div>
                          <div className="text-[13px] text-textPrimary">
                            {assignee?.name ?? 'Unassigned'}
                          </div>
                        </div>
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-[13px] ${
                          deadlineIsOverdue ? 'text-statusRed' : 'text-textPrimary'
                        }`}
                      >
                        {formatDate(p.deadline)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className="inline-flex h-2 w-2 rounded-full"
                          style={{ backgroundColor: priorityDot(p.priority) }}
                          aria-label={p.priority}
                          title={p.priority}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
