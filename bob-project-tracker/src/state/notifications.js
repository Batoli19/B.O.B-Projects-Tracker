import { PROJECTS, TEAM } from '../data/mockData.js'

function findMemberName(memberId) {
  return TEAM.find((m) => m.id === memberId)?.name ?? 'Someone'
}

function getLatestAuditTimestamp(project) {
  const ts = (project.auditTrail ?? [])
    .map((a) => a.timestamp)
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
  return ts ?? project.deadline
}

function daysUntil(dateStr) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(dateStr)
  const diffMs = target.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function generateNotifications() {
  const items = []

  for (const project of PROJECTS) {
    const baseTimestamp = getLatestAuditTimestamp(project)
    const latestActor =
      (project.auditTrail ?? [])
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
        ?.performedBy ?? project.assignedTo
    const actorName = findMemberName(latestActor)

    if (project.workflowStage === 'waiting-review') {
      items.push({
        id: `awaiting-${project.id}`,
        kind: 'awaiting',
        projectId: project.id,
        title: `Awaiting your sign-off on ${project.title}`,
        description: `${actorName} submitted updates and is waiting for review.`,
        timestamp: baseTimestamp,
      })
    }

    if (project.status === 'overdue') {
      items.push({
        id: `overdue-${project.id}`,
        kind: 'overdue',
        projectId: project.id,
        title: `OVERDUE: ${project.title} passed its deadline`,
        description: `Deadline was ${new Date(project.deadline).toDateString()}.`,
        timestamp: project.deadline,
      })
    }

    const remaining = daysUntil(project.deadline)
    if (remaining <= 7 && remaining >= 0) {
      items.push({
        id: `deadline-${project.id}`,
        kind: 'deadline',
        projectId: project.id,
        title: `Deadline approaching: ${project.title}`,
        description: `${remaining} day${remaining === 1 ? '' : 's'} remaining until ${new Date(project.deadline).toDateString()}.`,
        timestamp: baseTimestamp,
      })
    }

    if (project.workflowStage === 'finalized') {
      items.push({
        id: `finalized-${project.id}`,
        kind: 'finalized',
        projectId: project.id,
        title: `${project.title} has been finalized to Director`,
        description: `${actorName} finalized the project pack for leadership review.`,
        timestamp: baseTimestamp,
      })
    }
  }

  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .map((n, idx) => ({ ...n, _order: idx }))
}

