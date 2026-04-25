const STATUS_META = {
  'on-track': { label: 'On Track', color: '#16A34A' },
  'at-risk': { label: 'At Risk', color: '#D97706' },
  overdue: { label: 'Overdue', color: '#DC2626' },
  completed: { label: 'Completed', color: '#64748B' },
}

function withAlpha(hex, alpha) {
  const value = hex.replace('#', '')
  const r = parseInt(value.substring(0, 2), 16)
  const g = parseInt(value.substring(2, 4), 16)
  const b = parseInt(value.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META['on-track']
  return (
    <span
      className="inline-flex items-center rounded-[4px] border px-2 py-[2px] text-[12px] font-medium"
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

