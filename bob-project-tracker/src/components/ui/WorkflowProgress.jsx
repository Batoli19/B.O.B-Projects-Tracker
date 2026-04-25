const STAGES = ['draft', 'waiting-review', 'signed-off', 'finalized', 'resolved']

function titleCase(stage) {
  return stage
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

export default function WorkflowProgress({ stage = 'draft' }) {
  const currentIndex = Math.max(0, STAGES.indexOf(stage))

  return (
    <div className="flex items-center gap-2">
      {STAGES.map((s, idx) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: idx <= currentIndex ? '#0F6E56' : '#E2E8F0',
            }}
            aria-label={titleCase(s)}
            title={titleCase(s)}
          />
          {idx < STAGES.length - 1 ? (
            <div className="h-px w-6 bg-border" />
          ) : null}
        </div>
      ))}
    </div>
  )
}
