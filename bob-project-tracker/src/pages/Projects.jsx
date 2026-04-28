import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, PlusCircle, Search } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import TypeBadge from '../components/ui/TypeBadge.jsx'
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
        <h1 className="font-heading text-xl font-semibold">All Projects</h1>
        <button
          type="button"
          onClick={() => navigate('/projects/new')}
          className="inline-flex items-center gap-2 rounded-btn bg-primary px-[18px] py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-sidebarStart"
        >
          <PlusCircle className="h-4 w-4 text-white" />
          <span>New Project</span>
        </button>
      </div>

      <div className="rounded-card border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="h-10 w-full rounded-btn border border-border bg-white pl-9 pr-3 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-teal/30"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 w-full rounded-btn border border-border bg-white px-3 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal/30"
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
            className="h-10 w-full rounded-btn border border-border bg-white px-3 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal/30"
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
            className="h-10 w-full rounded-btn border border-border bg-white px-3 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal/30"
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
                className="text-sm font-medium text-teal hover:underline"
              >
                Clear Filters
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-textSecondary">
        {stats.total} total - {stats.completed} completed - {stats.inProgress} in progress -{' '}
        {stats.overdue} overdue
      </div>

      <div className="rounded-card border border-border bg-card">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-mutedBg border-b-2 border-border">
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
                    className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[1.2px] text-slate-400"
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
                      <FolderOpen className="h-12 w-12 text-textSecondary" />
                      <div className="text-sm font-semibold text-textPrimary">
                        No projects found
                      </div>
                      <div className="text-sm text-textSecondary">
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
                      className="cursor-pointer border-b border-tableRowBorder text-[14px] transition-colors duration-100 hover:bg-tableRowHover"
                      onClick={() => navigate(`/projects/${p.id}`)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-textSecondary">
                        {idx + 1}
                      </td>
                      <td className="min-w-64 px-4 py-3 text-sm font-semibold text-textPrimary">
                        {p.title}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <TypeBadge type={p.type} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex items-center rounded-btn border border-border bg-mutedBg px-2 py-0.5 text-xs font-medium text-textSecondary">
                          {stageLabel(p.workflowStage)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-primary text-xs font-bold text-white">
                            {assignee?.avatar ?? '--'}
                          </div>
                          <div className="text-sm text-textPrimary">
                            {assignee?.name ?? 'Unassigned'}
                          </div>
                        </div>
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-sm ${
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
