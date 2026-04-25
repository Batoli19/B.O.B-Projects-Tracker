export default function StatusBadge({ status, size = 'sm' }) {
  const sizeClass =
    size === 'md'
      ? 'px-2.5 py-1 text-sm'
      : 'px-2 py-[3px] text-[11px]'

  const base = ['inline-flex items-center whitespace-nowrap rounded-[4px] border font-semibold', sizeClass]

  if (status === 'completed') {
    return (
      <span
        className={[...base, 'bg-statusBadgeCompletedBg text-statusGreen border-statusBadgeCompletedBorder'].join(' ')}
      >
        Completed
      </span>
    )
  }

  if (status === 'on-track') {
    return (
      <span
        className={[...base, 'bg-statusBadgeOnTrackBg text-statusBadgeOnTrackText border-statusBadgeOnTrackBorder'].join(' ')}
      >
        On Track
      </span>
    )
  }

  if (status === 'at-risk') {
    return (
      <span
        className={[...base, 'bg-statusBadgeAtRiskBg text-statusOrange border-statusBadgeAtRiskBorder'].join(' ')}
      >
        At Risk
      </span>
    )
  }

  if (status === 'overdue') {
    return (
      <span
        className={[...base, 'bg-statusBadgeOverdueBg text-statusRed border-statusBadgeOverdueBorder'].join(' ')}
      >
        Overdue
      </span>
    )
  }

  // Workflow stages / fallback
  const stageLabel =
    status === 'waiting-review'
      ? 'Waiting Review'
      : status === 'signed-off'
        ? 'Signed Off'
        : status === 'finalized'
          ? 'Finalized'
          : status === 'resolved'
            ? 'Resolved'
            : 'Draft'

  return (
    <span className={[...base, 'bg-mutedBg text-textSecondary border-border'].join(' ')}>
      {stageLabel}
    </span>
  )
}
