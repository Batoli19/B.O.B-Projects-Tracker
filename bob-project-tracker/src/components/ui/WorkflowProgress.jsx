import { Check } from 'lucide-react'

const STAGES = [
  { key: 'draft', label: 'Draft' },
  { key: 'waiting-review', label: 'Waiting for Review' },
  { key: 'signed-off', label: 'Signed Off' },
  { key: 'finalized', label: 'Finalized to Director' },
  { key: 'resolved', label: 'Resolved' },
]

export default function WorkflowProgress({ stage = 'draft' }) {
  const currentIndex = Math.max(0, STAGES.findIndex((s) => s.key === stage))

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[680px] px-1">
        <div className="flex items-center">
          {STAGES.map((s, idx) => {
            const isComplete = idx < currentIndex
            const isCurrent = idx === currentIndex
            const circleClass = isComplete
              ? 'bg-primary text-white border-primary'
              : isCurrent
                ? 'bg-teal text-white border-teal'
                : 'bg-card text-textSecondary border-border border-dashed'

            const lineClass =
              idx < currentIndex ? 'bg-primary' : idx === currentIndex ? 'bg-teal/30' : 'bg-border'

            return (
              <div key={s.key} className="flex flex-1 items-center">
                <div className="flex min-w-0 flex-col items-center">
                  <div
                    className={['flex h-9 w-9 items-center justify-center rounded-full border', circleClass].join(' ')}
                    aria-label={s.label}
                    title={s.label}
                  >
                    {isComplete ? <Check className="h-5 w-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>
                  <div className="mt-2 max-w-[140px] text-center text-[11px] font-semibold tracking-[0.2px] text-textSecondary">
                    {s.label}
                  </div>
                </div>

                {idx < STAGES.length - 1 ? (
                  <div className="mx-2 h-px flex-1">
                    <div className={['h-px w-full', lineClass].join(' ')} />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
