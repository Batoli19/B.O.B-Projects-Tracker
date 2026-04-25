import { createContext, useContext, useMemo, useState } from 'react'
import { generateNotifications } from './notifications.js'

const STORAGE_KEY = 'bobTracker.readNotifications.v1'

function loadReadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.map(String))
  } catch {
    return new Set()
  }
}

function saveReadIds(readIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)))
  } catch {
    // ignore
  }
}

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const allNotifications = useMemo(() => generateNotifications(), [])
  const [readIds, setReadIds] = useState(() => loadReadIds())

  const notifications = useMemo(
    () =>
      allNotifications.map((n) => ({
        ...n,
        unread: !readIds.has(String(n.id)),
      })),
    [allNotifications, readIds],
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  )

  function markRead(id) {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(String(id))
      saveReadIds(next)
      return next
    })
  }

  function markAllRead() {
    setReadIds((prev) => {
      const next = new Set(prev)
      for (const n of allNotifications) next.add(String(n.id))
      saveReadIds(next)
      return next
    })
  }

  const value = useMemo(
    () => ({ notifications, unreadCount, markRead, markAllRead }),
    [notifications, unreadCount],
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}

