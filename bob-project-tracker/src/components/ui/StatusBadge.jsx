const STATUS_META = {
  completed: { label: 'Completed', color: '#64748B' },
  'on-track': { label: 'On Track', color: '#16A34A' },
  'at-risk': { label: 'At Risk', color: '#D97706' },
  overdue: { label: 'Overdue', color: '#DC2626' },

  draft: { label: 'Draft', color: '#64748B' },
  'waiting-review': { label: 'Waiting Review', color: '#D97706' },
  'signed-off': { label: 'Signed Off', color: '#1A3A6B' },
  finalized: { label: 'Finalized', color: '#1A3A6B' },
  resolved: { label: 'Resolved', color: '#16A34A' },
}

function withAlpha(hex, alpha) {
  const value = hex.replace('#', '')
  const r = parseInt(value.substring(0, 2), 16)
  const g = parseInt(value.substring(2, 4), 16)
  const b = parseInt(value.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function StatusBadge({ status, size = 'sm' }) {
  const meta = STATUS_META[status] ?? STATUS_META.draft
  const sizeClass =
    size === 'md'
      ? 'px-2.5 py-1 text-sm'
      : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={['inline-flex items-center rounded border font-medium', sizeClass].join(
        ' ',
      )}
      style={{
        borderColor: meta.color,
        color: meta.color,
        backgroundColor: withAlpha(meta.color, 0.1),
      }}
    >
      {meta.label}
    </span>
  )
}
