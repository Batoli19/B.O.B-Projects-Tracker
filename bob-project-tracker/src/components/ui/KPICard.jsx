export default function KPICard({
  label,
  value,
  icon: Icon,
  accentColor,
  iconBg,
}) {
  return (
    <div
      className="rounded-card border border-border bg-card p-6"
      style={{ borderTop: `4px solid ${accentColor}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-heading text-[36px] font-extrabold leading-none text-textPrimary">
            {value}
          </div>
          <div className="mt-2 text-[12px] font-medium uppercase tracking-[0.8px] text-textSecondary">
            {label}
          </div>
        </div>
        {Icon ? (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-card"
            style={{
              backgroundColor: iconBg ?? `${accentColor}1A`,
            }}
          >
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
