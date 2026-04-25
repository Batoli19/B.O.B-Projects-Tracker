import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

const ToastContext = createContext(null)

function ToastItem({ toast, onDismiss }) {
  return (
    <div className="pointer-events-auto flex w-full items-start gap-3 rounded-card border border-border bg-card p-4">
      <CheckCircle2 className="mt-0.5 h-5 w-5 text-statusGreen" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-textPrimary">{toast.title}</div>
        {toast.message ? (
          <div className="mt-1 text-sm text-textSecondary">{toast.message}</div>
        ) : null}
      </div>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-btn border border-border bg-card text-textSecondary hover:bg-mutedBg"
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, message }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const toast = { id, title, message }
      setToasts((prev) => [toast, ...prev].slice(0, 3))
      window.setTimeout(() => dismiss(id), 2500)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 w-full max-w-sm space-y-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

