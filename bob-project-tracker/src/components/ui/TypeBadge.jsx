const TYPE_META = {
  Audit: {
    label: 'Audit',
    className:
      'bg-typeBadgeAuditBg text-typeBadgeAuditText border-typeBadgeAuditBorder',
  },
  IT: {
    label: 'IT',
    className: 'bg-typeBadgeItBg text-typeBadgeItText border-typeBadgeItBorder',
  },
  Compliance: {
    label: 'Compliance',
    className:
      'bg-typeBadgeComplianceBg text-typeBadgeComplianceText border-typeBadgeComplianceBorder',
  },
  Inspection: {
    label: 'Inspection',
    className:
      'bg-typeBadgeInspectionBg text-typeBadgeInspectionText border-typeBadgeInspectionBorder',
  },
  Policy: {
    label: 'Policy',
    className:
      'bg-typeBadgePolicyBg text-typeBadgePolicyText border-typeBadgePolicyBorder',
  },
  Research: {
    label: 'Research',
    className:
      'bg-typeBadgeResearchBg text-typeBadgeResearchText border-typeBadgeResearchBorder',
  },
}

export default function TypeBadge({ type }) {
  const meta = TYPE_META[type] ?? {
    label: type,
    className: 'bg-mutedBg text-textSecondary border-border',
  }

  return (
    <span
      className={[
        'inline-flex items-center whitespace-nowrap rounded-[4px] border px-2 py-[3px] text-[11px] font-semibold',
        meta.className,
      ].join(' ')}
    >
      {meta.label}
    </span>
  )
}

