export default function KPICard({ label, value, icon: Icon, accentColor }) {
  return (
    <div className="rounded-card border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-heading text-3xl font-bold leading-none text-textPrimary">
            {value}
          </div>
          <div className="mt-2 text-sm text-textSecondary">{label}</div>
        </div>
        {Icon ? (
          <Icon className="h-6 w-6" style={{ color: accentColor }} />
        ) : null}
      </div>
    </div>
  )
}
