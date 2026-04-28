import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEAM } from '../data/mockData.js'
import { useToast } from '../state/ToastProvider.jsx'

const TYPES = ['Audit', 'IT', 'Compliance', 'Inspection', 'Policy', 'Research']

function Pill({ active, colorClass, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'tab',
        active ? `${colorClass} border-transparent text-white` : 'tab-inactive',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default function NewProject() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Audit')
  const [priority, setPriority] = useState('medium')

  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [inspectionDate, setInspectionDate] = useState('')
  const [auditDate, setAuditDate] = useState('')

  const [assignedTo, setAssignedTo] = useState(String(TEAM[0]?.id ?? 1))
  const [stage, setStage] = useState('draft')
  const [notes, setNotes] = useState('')

  const canSubmit = useMemo(() => title.trim().length > 0, [title])

  function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    showToast({
      title: 'Project created',
      message: `"${title.trim()}" added to the tracker.`,
    })

    // No persistence yet (mock data only) - navigate back to the list.
    navigate('/projects')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-textPrimary">
          Create New Project
        </h1>
        <div className="mt-1 text-sm text-textSecondary">
          Add a new project to the Bank of Botswana tracker
        </div>
      </div>

      <form onSubmit={onSubmit} className="card">
        <div className="space-y-6">
          <section>
            <div className="card-title">Project Information</div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-textPrimary">
                  Project Title <span className="text-statusRed">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="field mt-2"
                  placeholder="e.g., Treasury Controls Review"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-textPrimary">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="field-textarea mt-2"
                  placeholder="Add context, scope, and key deliverables..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-textPrimary">Project Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="field mt-2"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-textPrimary">Priority</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Pill
                      label="High"
                      active={priority === 'high'}
                      colorClass="bg-statusRed"
                      onClick={() => setPriority('high')}
                    />
                    <Pill
                      label="Medium"
                      active={priority === 'medium'}
                      colorClass="bg-statusOrange"
                      onClick={() => setPriority('medium')}
                    />
                    <Pill
                      label="Low"
                      active={priority === 'low'}
                      colorClass="bg-statusGreen"
                      onClick={() => setPriority('low')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="card-title">Dates & Deadlines</div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-textPrimary">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="field mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-textPrimary">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="field mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-textPrimary">Inspection Date</label>
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="field mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-textPrimary">Audit Date</label>
                <input
                  type="date"
                  value={auditDate}
                  onChange={(e) => setAuditDate(e.target.value)}
                  className="field mt-2"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="card-title">Assignment</div>
            <div className="mt-4">
              <label className="text-sm font-medium text-textPrimary">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="field mt-2"
              >
                {TEAM.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name} - {m.role}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section>
            <div className="card-title">Initial Workflow Stage</div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-textPrimary">Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="field mt-2"
                >
                  <option value="draft">Draft</option>
                  <option value="waiting-review">Waiting for Review</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-textPrimary">
                  Initial Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="field-textarea mt-2"
                  placeholder="Any notes for the reviewer..."
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                'btn-primary',
                canSubmit ? '' : 'cursor-not-allowed opacity-60',
              ].join(' ')}
            >
              Create Project
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
