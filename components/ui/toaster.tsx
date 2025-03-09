"use client"

import { useState, useCallback, useEffect } from "react"
import { Toast, type ToastProps, ToastProvider } from "./toast"

export function Toaster() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])
  const [mounted, setMounted] = useState(false)

  // Use useEffect to handle component mounting
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const toast = useCallback(({ title, description, variant = "default" }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  // Don't render until component is mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <ToastProvider value={{ toast }}>
      <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 w-full max-w-sm p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClick={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastProvider>
  )
}

